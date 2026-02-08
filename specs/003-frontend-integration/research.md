# Research: Frontend Application & Integration

**Feature**: 003-frontend-integration
**Date**: 2026-02-06
**Purpose**: Resolve technical unknowns and establish implementation patterns for Next.js frontend

---

## Question 1: Better Auth Integration with Next.js App Router

### Decision
Use Better Auth React SDK with client-side session management and Next.js middleware for protected routes.

### Rationale
- Better Auth provides official React SDK with hooks (`useSession`, `useAuth`)
- Next.js 16 App Router supports middleware for route protection
- Client Components can access auth state via hooks
- Server Components can read session from middleware

### Implementation Pattern
```typescript
// app/layout.tsx
import { SessionProvider } from 'better-auth/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

// middleware.ts
import { withAuth } from 'better-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/tasks/:path*'], // Protected routes
};

// hooks/useAuth.ts
import { useSession } from 'better-auth/react';

export function useAuth() {
  const { data: session } = useSession();
  const token = session?.access_token;
  return { session, token, isAuthenticated: !!token };
}
```

### Alternatives Considered
- **Manual JWT storage in localStorage**: Rejected - not secure, no automatic refresh
- **NextAuth.js**: Rejected - spec mandates Better Auth

### References
- Better Auth React Documentation
- Next.js Middleware Documentation
- App Router Authentication Patterns

---

## Question 2: API Client Configuration

### Decision
Use native fetch API with `authenticatedFetch()` wrapper function that automatically includes JWT token and handles errors.

### Rationale
- No external dependencies needed
- Modern browsers support fetch natively
- Simple wrapper provides consistent error handling
- Easy to test and maintain
- Automatic token injection from Better Auth session

### Implementation Pattern
```typescript
// lib/api/client.ts
import { getSession } from 'better-auth/react';

export class APIError extends Error {
  constructor(public status: number, public detail: string) {
    super(detail);
    this.name = 'APIError';
  }
}

export async function authenticatedFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const session = await getSession();
  const token = session?.access_token;

  if (!token) {
    window.location.href = '/login';
    throw new APIError(401, 'Not authenticated');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  // Handle authentication failures
  if (response.status === 401) {
    window.location.href = '/login';
    throw new APIError(401, 'Session expired');
  }

  // Handle authorization failures
  if (response.status === 403) {
    throw new APIError(403, 'Access forbidden');
  }

  // Handle other errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new APIError(response.status, error.detail);
  }

  return response;
}
```

### Alternatives Considered
- **Axios**: Rejected - extra dependency, overkill for simple REST calls
- **React Query**: Rejected - adds complexity, not needed for this scope
- **SWR**: Rejected - similar to React Query, unnecessary

### References
- MDN Fetch API Documentation
- Better Auth Session Management

---

## Question 3: State Management Strategy

### Decision
Use React built-in state management (useState, useEffect) with custom hooks encapsulating API logic.

### Rationale
- Small scope (single task list view)
- No complex state relationships
- Custom hooks provide clean API integration layer
- Keeps dependencies minimal
- Easier to understand and maintain

### Implementation Pattern
```typescript
// hooks/useTasks.ts
import { useState, useEffect, useCallback } from 'react';
import * as taskAPI from '@/lib/api/tasks';
import type { Task } from '@/lib/api/types';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading('loading');
    try {
      const data = await taskAPI.getTasks();
      setTasks(data);
      setLoading('success');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      setLoading('error');
    }
  }, []);

  const createTask = useCallback(async (title: string) => {
    const newTask = await taskAPI.createTask({ title });
    setTasks(prev => [newTask, ...prev]); // Add to top
  }, []);

  const toggleTask = useCallback(async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    try {
      const updated = await taskAPI.toggleTask(id, { completed });
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      // Rollback on error
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, title: string) => {
    const updated = await taskAPI.updateTask(id, { title });
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await taskAPI.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    toggleTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
```

### Alternatives Considered
- **Redux**: Rejected - overkill for 5 user stories and single view
- **Zustand**: Rejected - simpler than Redux but still unnecessary
- **React Context**: Rejected - hooks pattern is cleaner for this scope

### References
- React Hooks Documentation
- Custom Hooks Best Practices

---

## Question 4: TypeScript Type Generation

### Decision
Manually define TypeScript interfaces matching backend Pydantic schemas from Spec 002.

### Rationale
- Simple scope (only 5 schemas to define)
- Backend schemas are stable
- Manual types ensure full understanding
- No build complexity from code generation
- Easy to maintain and document

### Implementation Pattern
```typescript
// lib/api/types.ts

/**
 * Task entity - matches backend TaskResponse schema
 * @see specs/002-backend-api-data/contracts/openapi.yaml
 */
export interface Task {
  id: string;           // UUID
  title: string;        // 1-500 characters, trimmed, non-empty
  completed: boolean;   // Task completion state
  user_id: string;      // UUID of task owner
  created_at: string;   // ISO 8601 datetime
  updated_at: string;   // ISO 8601 datetime
}

/**
 * Request to create new task - matches backend TaskCreate schema
 * Validation: title must be 1-500 chars, trimmed, non-whitespace
 */
export interface TaskCreateRequest {
  title: string;
}

/**
 * Request to update task title - matches backend TaskUpdate schema
 * Same validation as TaskCreate
 */
export interface TaskUpdateRequest {
  title: string;
}

/**
 * Request to toggle task completion - matches backend TaskToggle schema
 */
export interface TaskToggleRequest {
  completed: boolean;
}

/**
 * API error response format
 */
export interface APIError {
  detail: string | Record<string, string[]>;
}
```

### Alternatives Considered
- **OpenAPI TypeScript Generator**: Rejected - adds build step, overkill for 5 types
- **Shared schema monorepo**: Rejected - over-engineering for hackathon

### References
- Spec 002 OpenAPI Schema (specs/002-backend-api-data/contracts/openapi.yaml)
- TypeScript Handbook

---

## Question 5: Responsive Design Approach

### Decision
Mobile-first CSS with Tailwind utility classes and standard breakpoints.

### Rationale
- Tailwind provides responsive utilities out-of-the-box
- Mobile-first ensures core experience works on smallest screens
- No custom CSS needed for most components
- Rapid development with utility classes
- Easy to maintain and understand

### Breakpoints
- **Default** (< 640px): Mobile (320px min width)
- **sm** (≥ 640px): Large mobile / small tablet
- **md** (≥ 768px): Tablet
- **lg** (≥ 1024px): Desktop
- **xl** (≥ 1280px): Large desktop

### Implementation Pattern
```tsx
// Mobile-first responsive grid for task list
<div className="
  grid
  grid-cols-1        // Mobile: single column
  sm:grid-cols-2     // Tablet: two columns
  lg:grid-cols-3     // Desktop: three columns
  gap-4
  p-4
">
  {tasks.map(task => <TaskItem key={task.id} task={task} />)}
</div>

// Responsive text sizes
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  My Tasks
</h1>

// Responsive padding/spacing
<div className="px-4 sm:px-6 lg:px-8">
  <CreateTaskForm />
</div>
```

### Alternatives Considered
- **CSS Modules**: Rejected - more boilerplate, manual media queries
- **Styled Components**: Rejected - runtime CSS-in-JS performance cost
- **Desktop-first**: Rejected - mobile experience is primary

### References
- Tailwind CSS Responsive Design Documentation
- Mobile-First CSS Best Practices

---

## Question 6: Form Validation

### Decision
Vanilla React with manual validation logic (no form library).

### Rationale
- Simple validation rules (title length, whitespace check)
- No complex form logic requiring library
- Keeps dependencies minimal
- Full control over validation flow
- Easy to understand and customize

### Implementation Pattern
```typescript
// components/CreateTaskForm.tsx
import { useState } from 'react';

export function CreateTaskForm({ onSubmit }: { onSubmit: (title: string) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateTitle = (value: string): string | null => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return 'Task title cannot be empty';
    }
    if (trimmed.length > 500) {
      return 'Task title must be 500 characters or less';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateTitle(title);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(title.trim());
      setTitle(''); // Clear on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError(null); // Clear error on typing
        }}
        placeholder="What needs to be done?"
        maxLength={500}
        disabled={loading}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Add Task'}
      </button>
    </form>
  );
}
```

### Alternatives Considered
- **React Hook Form**: Rejected - overkill for single input form
- **Formik**: Rejected - adds complexity and bundle size

### References
- React Forms Documentation
- HTML5 Form Validation

---

## Question 7: Error Handling Patterns

### Decision
Inline error messages near relevant components (no toast library).

### Rationale
- Clearer association between error and UI element
- No external dependency
- Persistent until user takes action
- Better for accessibility
- Simpler to implement and test

### Implementation Pattern
```tsx
// Inline error for form validation
<div>
  <input {...props} />
  {validationError && (
    <p className="text-red-600 text-sm mt-1" role="alert">
      {validationError}
    </p>
  )}
</div>

// Inline error for API operations
<div>
  <TaskItem task={task} onToggle={handleToggle} />
  {toggleError && (
    <p className="text-red-600 text-xs mt-1" role="alert">
      Failed to update task. <button onClick={retry}>Retry</button>
    </p>
  )}
</div>

// Page-level error for critical failures
{error && (
  <div className="bg-red-50 border border-red-200 rounded p-4" role="alert">
    <p className="text-red-800 font-medium">Error loading tasks</p>
    <p className="text-red-600 text-sm">{error}</p>
    <button onClick={refetch}>Try Again</button>
  </div>
)}
```

### Alternatives Considered
- **Toast notifications** (react-toastify, sonner): Rejected - easy to miss, dismissed too quickly
- **Modal dialogs**: Rejected - too disruptive for non-critical errors

### References
- Web Accessibility Guidelines for Error Messages
- ARIA Alert Role Documentation

---

## Question 8: Authentication Flow

### Decision
Use Better Auth SDK with automatic redirects and protected route middleware.

### Rationale
- Better Auth handles token storage securely
- Middleware protects routes declaratively
- Automatic redirect to login on 401
- Session persistence across page refreshes
- Centralized auth logic

### Implementation Pattern
```typescript
// middleware.ts - Protect /tasks routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('better-auth.session');

  if (!session && request.nextUrl.pathname.startsWith('/tasks')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tasks/:path*'],
};

// lib/api/client.ts - Handle 401 in API calls
if (response.status === 401) {
  // Clear invalid session
  await signOut();
  // Redirect to login
  window.location.href = '/login';
  throw new APIError(401, 'Session expired');
}

// hooks/useRequireAuth.ts - Client-side protection
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated };
}
```

### Session Storage
- Better Auth SDK handles storage (cookies or localStorage)
- HttpOnly cookies preferred for security
- Automatic token refresh if supported

### Alternatives Considered
- **Manual localStorage management**: Rejected - not secure, vulnerable to XSS
- **Server-side sessions**: Rejected - violates stateless architecture (Constitution III)

### References
- Better Auth Session Management Documentation
- Next.js Middleware Authentication Patterns
- JWT Best Practices

---

## Summary of Research Decisions

| Question | Decision | Key Rationale |
|----------|----------|---------------|
| 1. Better Auth Integration | React SDK + Next.js middleware | Official SDK, automatic token management |
| 2. API Client | Native fetch + wrapper | No dependencies, simple, effective |
| 3. State Management | React hooks + custom hooks | Sufficient for scope, minimal complexity |
| 4. TypeScript Types | Manual definitions | Simple scope, full control, no build complexity |
| 5. Responsive Design | Tailwind + mobile-first | Built-in utilities, rapid development |
| 6. Form Validation | Vanilla React | Simple rules, no library needed |
| 7. Error Handling | Inline messages | Clear association, accessible, persistent |
| 8. Authentication Flow | Better Auth SDK + middleware | Secure, automatic, declarative |

**Common Themes**:
- Minimize external dependencies
- Leverage platform capabilities (native fetch, React hooks, Tailwind)
- Keep complexity low for hackathon scope
- Prioritize clarity and maintainability
- Follow constitutional principles (security, separation of concerns)

---

**Research Status**: ✅ Complete
**Next Phase**: Data Model & Contracts (Phase 1)
