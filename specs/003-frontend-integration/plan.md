# Implementation Plan: Frontend Application & Integration

**Branch**: `003-frontend-integration` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/003-frontend-integration/spec.md`

---

## Summary

Build a responsive Next.js 16+ frontend for the Todo application that integrates with the Backend API (Spec 002) and Better Auth (Spec 001). The frontend provides a complete task management interface with secure JWT-based authentication, real-time UI updates, and responsive design for mobile, tablet, and desktop devices.

**Primary Requirement**: Implement P1 MVP user stories (View Task List + Create Tasks) first, followed by P2/P3 enhancements (Toggle, Update, Delete).

**Technical Approach** (from research.md):
- **Framework**: Next.js 16+ App Router with TypeScript
- **Styling**: Tailwind CSS with mobile-first responsive design
- **State Management**: React built-in hooks (useState, useEffect) + custom hooks
- **API Client**: Native fetch with `authenticatedFetch()` wrapper
- **Authentication**: Better Auth React SDK with Next.js middleware
- **Form Validation**: Vanilla React with manual validation logic
- **Error Handling**: Inline error messages (no toast library)

---

## Technical Context

**Language/Version**: TypeScript 5.x + JavaScript ES2022
**Primary Dependencies**: Next.js 16+, React 19+, Tailwind CSS, Better Auth React SDK
**Storage**: Backend API (Spec 002) via RESTful HTTP requests
**Testing**: Manual testing following quickstart.md test scenarios
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend + backend integration)
**Performance Goals**:
- Page load < 2 seconds (SC-001)
- Task creation < 1 second (SC-002)
- Toggle completion < 500ms (SC-003)

**Constraints**:
- Must use Better Auth for authentication (Spec 001 dependency)
- Must integrate with Backend API (Spec 002 dependency)
- JWT tokens required on all API requests
- No manual coding - all code via Claude Code agents
- Responsive: 320px mobile to 1920px+ desktop

**Scale/Scope**:
- 5 user stories (2 P1 MVP, 1 P2, 2 P3)
- Single task list view
- CRUD operations for tasks
- User authentication flows (signup/signin/signout)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Constitution Compliance Review

**I. Spec-Driven Development (NON-NEGOTIABLE)**
- ✅ Specification complete and approved (specs/003-frontend-integration/spec.md)
- ✅ Implementation plan follows spec → plan → tasks workflow
- ✅ All artifacts traceable (spec.md, plan.md, research.md, data-model.md, contracts/)
- ✅ Implementation via Claude Code agents only (nextjs-frontend-builder)

**II. End-to-End Correctness Across All Layers**
- ✅ Data contracts consistent: Frontend TypeScript types match backend Pydantic schemas (see data-model.md alignment table)
- ✅ User authentication synchronized: Better Auth JWT tokens verified by FastAPI backend
- ✅ Database models match API responses: Task interface mirrors TaskResponse schema
- ✅ Error handling consistent: HTTP status codes (400, 401, 403, 404, 422, 500) handled uniformly
- ✅ User isolation enforced: JWT token user_id scoped queries, no cross-user access

**III. Security-First Architecture (NON-NEGOTIABLE)**
- ✅ JWT-based stateless authentication mandatory for all API access
- ✅ Protected API endpoints verify JWT tokens (middleware checks)
- ✅ User ID in requests matches authenticated user from JWT
- ✅ Cross-user data access prohibited (enforced by backend filters)
- ✅ Secrets stored in environment variables (.env.local, not hardcoded)
- ✅ Token expiry enforced (time-limited JWTs with automatic redirect on 401)
- ✅ Unauthorized requests rejected with HTTP 401/403 status codes

**IV. Clear Separation of Concerns**
- ✅ Authentication Layer (Better Auth): User signup/signin, JWT token issuance
- ✅ Backend Layer (FastAPI): Business logic, validation, user-scoped queries (Spec 002)
- ✅ Frontend Layer (Next.js): User interface, form handling, authenticated API calls
- ✅ Data Layer (Neon PostgreSQL): Data persistence (Spec 002)
- ✅ Layers communicate through well-defined contracts: REST APIs with JSON payloads

**V. Reproducibility via Explicit Artifacts**
- ✅ Feature specification: specs/003-frontend-integration/spec.md
- ✅ Implementation plan: specs/003-frontend-integration/plan.md
- ✅ Task list: specs/003-frontend-integration/tasks.md (generated via /sp.tasks)
- ✅ Research decisions: specs/003-frontend-integration/research.md
- ✅ Data model: specs/003-frontend-integration/data-model.md
- ✅ API contracts: specs/003-frontend-integration/contracts/api-client.md
- ✅ Quickstart guide: specs/003-frontend-integration/quickstart.md
- ✅ All artifacts version-controlled and traceable

**VI. Agent-Generated Code Only (NON-NEGOTIABLE)**
- ✅ All frontend code generated via `nextjs-frontend-builder` agent
- ✅ Authentication integration via `auth-security-specialist` agent
- ✅ Backend API integration patterns defined (research.md, contracts/)
- ✅ Agents invoked with complete context from specs and plans
- ✅ Generated code must be spec-compliant and deterministic

### ✅ Technology Stack Compliance

| Layer | Required Technology | Planned Technology | Status |
|-------|---------------------|-------------------|--------|
| Frontend | Next.js 16+ (App Router) | Next.js 16+ App Router | ✅ Compliant |
| Backend | Python FastAPI | FastAPI (Spec 002) | ✅ Compliant |
| ORM | SQLModel | SQLModel (Spec 002) | ✅ Compliant |
| Database | Neon Serverless PostgreSQL | Neon PostgreSQL (Spec 002) | ✅ Compliant |
| Authentication | Better Auth (JWT) | Better Auth React SDK | ✅ Compliant |
| Spec Workflow | Claude Code + Spec-Kit Plus | Claude Code agents | ✅ Compliant |

### ✅ Security Requirements Validation

**Authentication Flow** (Constitution §III):
1. User Login (Frontend → Better Auth): ✅ Better Auth SDK handles login
2. API Request (Frontend → Backend): ✅ JWT in Authorization header via authenticatedFetch()
3. Authorization (Backend): ✅ Backend verifies token and matches user_id

**Security Invariants**:
- ✅ No Cross-User Access: User A never sees User B's tasks (enforced by backend filters)
- ✅ Stateless Authentication: JWT is source of truth (no server-side sessions)
- ✅ Token Verification on Every Request: authenticatedFetch() includes token on all calls
- ✅ Secrets in Environment: BETTER_AUTH_SECRET, API_BASE_URL in .env.local
- ✅ HTTPS in Production: Enforced at deployment (not in dev)
- ✅ Input Sanitization: Client-side validation + backend validation

**Forbidden Practices**:
- ✅ No plaintext passwords (Better Auth handles hashing)
- ✅ No trusting client-provided user IDs (JWT user_id is source of truth)
- ✅ No bypassing authentication checks (middleware protects /tasks routes)
- ✅ No logging sensitive data (tokens, passwords excluded from logs)
- ✅ No exposing internal errors (generic user-facing messages)

### ✅ Quality Standards Compliance

**Code Quality**:
- ✅ Clarity: TypeScript interfaces with JSDoc comments (data-model.md)
- ✅ Structure: Standard Next.js App Router layout (src/app/, src/components/, src/lib/)
- ✅ Naming: Consistent across frontend/backend (Task, TaskCreateRequest, etc.)
- ✅ Comments: Minimal but sufficient (documented in research.md patterns)
- ✅ Error Handling: Explicit handling for auth, validation, database errors

**Error Handling Requirements** (all scenarios covered):
- ✅ 401 Unauthorized: Redirect to /login, clear session
- ✅ 403 Forbidden: Display "Access forbidden" message
- ✅ 422 Unprocessable Entity: Display validation errors inline
- ✅ 500 Internal Server Error: Display generic error with retry option
- ✅ 404 Not Found: Display "Task not found" message

### ✅ Development Workflow Compliance

1. **Specify** (`/sp.specify`): ✅ Complete (spec.md approved)
2. **Plan** (`/sp.plan`): ✅ In progress (this document)
3. **Tasks** (`/sp.tasks`): ⏳ Next phase (after plan approval)
4. **Implement** (`/sp.implement`): ⏳ Follows tasks
5. **Review**: ⏳ Validate against spec and constitution

**Agent Delegation Rules**:
- ✅ Authentication tasks → `auth-security-specialist`
- ✅ Frontend tasks → `nextjs-frontend-builder`
- ✅ Backend API tasks → `fastapi-backend` (Spec 002)
- ✅ Database tasks → `neon-db-manager` (Spec 002)

### 🎯 Constitution Check Result: **PASSED**

All constitutional principles satisfied. No violations to justify.

---

## Project Structure

### Documentation (this feature)

```text
specs/003-frontend-integration/
├── spec.md              # Feature specification (/sp.specify command output)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (8 research questions resolved)
├── data-model.md        # Phase 1 output (TypeScript types + validation)
├── quickstart.md        # Phase 1 output (testing guide)
├── contracts/           # Phase 1 output (API client contracts)
│   └── api-client.md    # API integration patterns and functions
├── checklists/
│   └── requirements.md  # Specification quality checklist (passed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created yet)
```

### Source Code (repository root)

```text
frontend/                        # Next.js 16+ App Router application
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout with SessionProvider
│   │   ├── page.tsx             # Home page (redirect to /tasks or /login)
│   │   ├── tasks/
│   │   │   └── page.tsx         # Task list page (main feature)
│   │   ├── login/
│   │   │   └── page.tsx         # Login page (Better Auth integration)
│   │   └── signup/
│   │       └── page.tsx         # Signup page (Better Auth integration)
│   │
│   ├── components/              # Reusable UI components
│   │   ├── TaskList.tsx         # Task list container
│   │   ├── TaskItem.tsx         # Individual task item
│   │   ├── CreateTaskForm.tsx   # Task creation form
│   │   ├── EditTaskForm.tsx     # Task editing form (inline)
│   │   └── Navigation.tsx       # Header navigation with logout
│   │
│   ├── lib/
│   │   ├── api/                 # Backend API integration
│   │   │   ├── index.ts         # Main exports
│   │   │   ├── client.ts        # authenticatedFetch() wrapper
│   │   │   ├── tasks.ts         # Task CRUD functions
│   │   │   └── types.ts         # TypeScript types (from data-model.md)
│   │   └── utils/               # Helper functions
│   │       ├── validation.ts    # validateTaskTitle(), sanitizeTaskTitle()
│   │       └── formatting.ts    # formatTaskDate() for relative dates
│   │
│   └── hooks/                   # Custom React hooks
│       ├── useTasks.ts          # Task list state management
│       └── useAuth.ts           # Authentication state wrapper
│
├── middleware.ts                # Next.js middleware for route protection
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Environment template
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # Setup and usage instructions
```

**Structure Decision**: **Option 2: Web application** (frontend + backend)

- `frontend/` contains Next.js application (this feature)
- `backend/` contains FastAPI application (Spec 002)
- Separation enables independent development and deployment
- Clear boundary between frontend and backend concerns
- Follows Constitution IV (Clear Separation of Concerns)

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations** - all constitutional principles satisfied. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| _None_ | _N/A_ | _N/A_ |

---

## Phase 0: Research (✅ Complete)

**Artifact**: [research.md](./research.md)

**Summary**: Resolved 8 technical unknowns and documented implementation patterns:

1. **Better Auth Integration**: React SDK + Next.js middleware for route protection
2. **API Client**: Native fetch with `authenticatedFetch()` wrapper (no Axios/React Query)
3. **State Management**: React hooks + custom hooks (no Redux/Zustand)
4. **TypeScript Types**: Manual definitions matching backend schemas (no code generation)
5. **Responsive Design**: Tailwind CSS with mobile-first approach
6. **Form Validation**: Vanilla React with manual validation logic
7. **Error Handling**: Inline error messages (no toast library)
8. **Authentication Flow**: Better Auth SDK with automatic token management

**Key Decisions**:
- Minimize external dependencies (leverage platform capabilities)
- Keep complexity low for hackathon scope
- Prioritize clarity and maintainability
- Follow constitutional principles (security, separation of concerns)

**Status**: ✅ All research questions resolved with rationale and alternatives

---

## Phase 1: Design & Contracts (✅ Complete)

### Phase 1A: Data Model (✅ Complete)

**Artifact**: [data-model.md](./data-model.md)

**Core Entities**:
- `Task`: Primary entity (id, title, completed, user_id, created_at, updated_at)
- `TaskCreateRequest`: Create task payload (title only)
- `TaskUpdateRequest`: Update task payload (title only)
- `TaskToggleRequest`: Toggle completion payload (completed boolean)
- `TaskListResponse`: Array of tasks from GET /api/tasks
- `APIErrorResponse`: Standard error format (detail field)

**UI State Types**:
- `LoadingState`: Async operation state ('idle' | 'loading' | 'success' | 'error')
- `TasksViewState`: Complete task list view state

**Validation Utilities**:
- `validateTaskTitle()`: Client-side validation matching backend rules
- `sanitizeTaskTitle()`: Trim whitespace for submission
- `formatTaskDate()`: ISO 8601 to relative format ("5m ago", "2d ago")

**Backend Alignment**:
- ✅ All TypeScript types match backend Pydantic schemas (Spec 002)
- ✅ Validation rules consistent (1-500 chars, trimmed, non-empty)
- ✅ HTTP status codes aligned (400, 401, 403, 404, 422, 500)

**Status**: ✅ Complete and verified against backend

---

### Phase 1B: API Contracts (✅ Complete)

**Artifact**: [contracts/api-client.md](./contracts/api-client.md)

**API Client Functions** (lib/api/tasks.ts):
- `getTasks()`: GET /api/tasks → Task[]
- `createTask(data)`: POST /api/tasks → Task
- `toggleTask(id, data)`: PATCH /api/tasks/{id} → Task
- `updateTask(id, data)`: PUT /api/tasks/{id} → Task
- `deleteTask(id)`: DELETE /api/tasks/{id} → void

**Authentication Wrapper** (lib/api/client.ts):
```typescript
authenticatedFetch(endpoint, options)
  → Inject JWT token in Authorization header
  → Handle 401 (redirect to login)
  → Handle 403 (display error)
  → Handle other errors (throw APIError)
```

**Error Handling**:
- 401 Unauthorized: Clear session, redirect to /login
- 403 Forbidden: Display "Access forbidden"
- 422 Validation Error: Parse and display validation messages
- 500 Server Error: Display generic error with retry

**Status**: ✅ Complete with all CRUD operations defined

---

### Phase 1C: Quickstart Guide (✅ Complete)

**Artifact**: [quickstart.md](./quickstart.md)

**Contents**:
- Prerequisites (Node.js 18+, backend running, Better Auth configured)
- Initial setup (npm install, .env.local configuration)
- Development workflow (npm run dev, build, lint)
- Comprehensive testing guide for all 5 user stories
- Browser DevTools testing (Network, Console, Application tabs)
- Responsive design testing (mobile, tablet, desktop)
- Error scenario testing (network failures, invalid tokens, backend unreachable)
- Success criteria validation checklist
- Troubleshooting common issues
- Performance testing guidelines
- Deployment checklist

**Status**: ✅ Complete testing guide ready for implementation validation

---

### Phase 1D: Agent Context Update (⏳ Pending)

**Script**: `.specify/scripts/bash/update-agent-context.sh claude`

**Purpose**: Update CLAUDE.md with frontend technology stack

**Changes to Add**:
```markdown
## Active Technologies
- Next.js 16+ (App Router), React 19+, TypeScript 5.x, Tailwind CSS (003-frontend-integration)
- Better Auth React SDK for authentication (003-frontend-integration)

## Recent Changes
- 003-frontend-integration: Added Next.js 16+ frontend with Better Auth integration
```

**Status**: ⏳ To be executed after plan approval (not blocking tasks generation)

---

## Architecture Decisions

### Decision 1: Next.js App Router over Pages Router

**Context**: Next.js 16 supports both App Router (new) and Pages Router (legacy)

**Decision**: Use Next.js App Router exclusively

**Rationale**:
- App Router is the recommended approach for new projects
- Better support for React Server Components
- Improved routing and layout capabilities
- Middleware integration for route protection
- Future-proof (Pages Router will be deprecated)

**Alternatives Considered**:
- Pages Router: Rejected - legacy approach, less future-proof
- Remix: Rejected - spec mandates Next.js

**Impact**:
- Modern routing patterns (`app/` directory)
- Server Components by default (Client Components marked with 'use client')
- Middleware for authentication protection

---

### Decision 2: Minimal External Dependencies

**Context**: Need to choose between third-party libraries vs. platform capabilities

**Decision**: Minimize external dependencies, leverage platform capabilities

**Rationale**:
- Reduces bundle size and complexity
- Easier to understand and maintain
- Faster to implement for hackathon scope
- Less security vulnerabilities
- Fewer breaking changes from dependency updates

**Alternatives Considered**:
- React Query: Rejected - overkill for simple CRUD operations
- Axios: Rejected - native fetch is sufficient
- Redux/Zustand: Rejected - React hooks sufficient for scope
- React Hook Form: Rejected - simple validation doesn't justify library

**Dependencies Adopted**:
- Next.js 16+ (required)
- React 19+ (required)
- TypeScript (required)
- Tailwind CSS (styling utility)
- Better Auth React SDK (authentication, required by spec)

**Impact**:
- Smaller bundle size
- Less build complexity
- Faster development (less configuration)
- More maintainable code

---

### Decision 3: Optimistic UI Updates

**Context**: Task toggle operations should feel instant

**Decision**: Implement optimistic updates with rollback on error

**Rationale**:
- Improves perceived performance (SC-003: < 500ms)
- Better user experience (immediate feedback)
- Aligns with modern web app patterns
- Simple rollback mechanism if API fails

**Implementation**:
```typescript
const toggleTask = async (id, completed) => {
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
};
```

**Alternatives Considered**:
- No optimistic updates: Rejected - feels slow, poor UX
- Optimistic without rollback: Rejected - leaves inconsistent state on error

**Impact**:
- Faster perceived performance
- Requires rollback logic on error
- Adds minimal complexity

---

### Decision 4: Inline Error Handling (No Toasts)

**Context**: Need to display errors for failed operations

**Decision**: Use inline error messages near relevant UI elements

**Rationale**:
- Clearer association between error and UI element
- Persistent until user takes action (not auto-dismissed)
- Better for accessibility (screen readers)
- No external dependency required
- Easier to test

**Implementation**:
```tsx
<div>
  <CreateTaskForm onSubmit={handleCreate} />
  {createError && (
    <p className="text-red-600 text-sm mt-1" role="alert">
      {createError}
    </p>
  )}
</div>
```

**Alternatives Considered**:
- Toast notifications (react-toastify, sonner): Rejected - easy to miss, dismissed too quickly
- Modal dialogs: Rejected - too disruptive for non-critical errors
- Global error boundary: Rejected - less granular control

**Impact**:
- Clear error context
- No external library
- Accessible by default

---

### Decision 5: Mobile-First Responsive Design

**Context**: Need to support 320px mobile to 1920px+ desktop

**Decision**: Mobile-first CSS with Tailwind utility classes

**Rationale**:
- Mobile traffic increasingly dominant
- Ensures core experience works on smallest screens
- Tailwind provides responsive utilities out-of-the-box
- Progressive enhancement for larger screens
- Aligns with modern web development best practices

**Breakpoints**:
- Default (< 640px): Mobile (320px min width)
- sm (≥ 640px): Large mobile / small tablet
- md (≥ 768px): Tablet
- lg (≥ 1024px): Desktop
- xl (≥ 1280px): Large desktop

**Implementation**:
```tsx
<div className="
  grid
  grid-cols-1        // Mobile: single column
  sm:grid-cols-2     // Tablet: two columns
  lg:grid-cols-3     // Desktop: three columns
  gap-4 p-4
">
  {tasks.map(task => <TaskItem key={task.id} task={task} />)}
</div>
```

**Alternatives Considered**:
- Desktop-first: Rejected - mobile experience would be degraded
- CSS Modules: Rejected - more boilerplate, manual media queries
- Styled Components: Rejected - runtime CSS-in-JS performance cost

**Impact**:
- Mobile-optimized by default
- Progressive enhancement for larger screens
- Faster development with Tailwind utilities

---

## Component Architecture

### Page Components (App Router)

**app/layout.tsx** (Root Layout):
- Wraps app with Better Auth `SessionProvider`
- Includes global styles and Tailwind CSS
- Navigation component (logout button when authenticated)

**app/page.tsx** (Home Page):
- Redirects authenticated users to `/tasks`
- Redirects unauthenticated users to `/login`

**app/tasks/page.tsx** (Task List Page - Main Feature):
- Protected route (requires authentication)
- Uses `useTasks()` hook for state management
- Renders `<TaskList>`, `<CreateTaskForm>` components
- Handles loading states and errors

**app/login/page.tsx** (Login Page):
- Better Auth sign-in form integration
- Redirects to `/tasks` on successful login

**app/signup/page.tsx** (Signup Page):
- Better Auth sign-up form integration
- Redirects to `/tasks` on successful signup

---

### UI Components

**components/TaskList.tsx**:
- Displays array of tasks
- Empty state when no tasks
- Maps tasks to `<TaskItem>` components
- Responsive grid layout

**components/TaskItem.tsx**:
- Displays single task
- Checkbox for toggle completion
- Inline edit mode for title updates
- Delete button with confirmation
- Optimistic updates for toggle

**components/CreateTaskForm.tsx**:
- Text input for task title
- Client-side validation (validateTaskTitle)
- Submit button with loading state
- Inline error display
- Auto-clear on success

**components/EditTaskForm.tsx**:
- Inline editing for task title
- Validation same as create
- Cancel button to revert
- Save/cancel on Enter/Escape

**components/Navigation.tsx**:
- App header with logo/title
- Logout button when authenticated
- Responsive layout

---

### Custom Hooks

**hooks/useTasks.ts**:
```typescript
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => { /* ... */ }, []);
  const createTask = useCallback(async (title) => { /* ... */ }, []);
  const toggleTask = useCallback(async (id, completed) => { /* ... */ }, []);
  const updateTask = useCallback(async (id, title) => { /* ... */ }, []);
  const deleteTask = useCallback(async (id) => { /* ... */ }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  return { tasks, loading, error, createTask, toggleTask, updateTask, deleteTask, refetch: fetchTasks };
}
```

**hooks/useAuth.ts**:
```typescript
export function useAuth() {
  const { data: session } = useSession(); // Better Auth SDK
  const token = session?.access_token;
  return { session, token, isAuthenticated: !!token };
}
```

---

### API Client Layer

**lib/api/client.ts** (HTTP Client):
```typescript
export async function authenticatedFetch(endpoint, options) {
  const session = await getSession();
  const token = session?.access_token;

  if (!token) {
    window.location.href = '/login';
    throw new APIError(401, 'Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  // Handle errors (401, 403, 4xx, 5xx)
  // ...

  return response;
}
```

**lib/api/tasks.ts** (Task API Functions):
```typescript
export async function getTasks(): Promise<Task[]> {
  const res = await authenticatedFetch('/api/tasks');
  return res.json();
}

export async function createTask(data: TaskCreateRequest): Promise<Task> {
  const res = await authenticatedFetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function toggleTask(id: string, data: TaskToggleRequest): Promise<Task> {
  const res = await authenticatedFetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTask(id: string, data: TaskUpdateRequest): Promise<Task> {
  const res = await authenticatedFetch(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  await authenticatedFetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
}
```

**lib/api/types.ts**: TypeScript types from data-model.md

---

## Data Flow Diagrams

### Create Task Flow

```
User types title → validateTaskTitle()
  ↓ (valid)
sanitizeTaskTitle() → TaskCreateRequest { title }
  ↓
authenticatedFetch() → POST /api/tasks (with JWT header)
  ↓
Backend validates → Creates task → Returns TaskResponse
  ↓
Task → Add to tasks array (setTasks)
  ↓
UI updates (new task appears at top)
```

### Toggle Task Flow

```
User clicks checkbox → Optimistic update (setTasks)
  ↓
TaskToggleRequest { completed } → authenticatedFetch()
  ↓
PATCH /api/tasks/{id} (with JWT header)
  ↓ (success)
Backend updates → Returns TaskResponse
  ↓
Confirm update (setTasks with server response)
  ↓ (error)
Rollback optimistic update → Display error
```

### Authentication Flow

```
User enters credentials → Better Auth SDK
  ↓
Better Auth validates → Creates session → Issues JWT token
  ↓
Token stored (cookies/localStorage) → SessionProvider
  ↓
User navigates to /tasks → middleware.ts checks session
  ↓ (authenticated)
Allow access → Render task list page
  ↓
useTasks() → getTasks() → authenticatedFetch()
  ↓
Include Authorization header (Bearer {token})
  ↓
Backend verifies JWT → Returns user's tasks
  ↓
UI displays tasks
```

---

## Testing Strategy

### Manual Testing (Primary Approach)

Following [quickstart.md](./quickstart.md) testing guide:

1. **Authentication Testing**: Signup, signin, protected routes, session persistence
2. **User Story 1 (View List)**: Empty state, task display, loading state, error state, responsive layout
3. **User Story 2 (Create Tasks)**: Valid creation, validation errors, API errors, loading state
4. **User Story 3 (Toggle Completion)**: Mark complete/incomplete, optimistic updates, rollback on error
5. **User Story 4 (Update Title)**: Edit task, cancel edit, validation, API errors
6. **User Story 5 (Delete Tasks)**: Delete with confirmation, cancel deletion, API errors

### Browser DevTools Testing

- **Network Tab**: Verify all requests include Authorization header, inspect payloads
- **Console Tab**: Check for JavaScript errors
- **Application Tab**: Verify JWT token storage and claims

### Responsive Design Testing

- **Mobile (320px-639px)**: Single column, touch targets, no horizontal scroll
- **Tablet (640px-1023px)**: Two column grid, comfortable spacing
- **Desktop (1024px+)**: Three column grid, optimal use of space

### Error Scenario Testing

- Network failures (offline mode)
- Invalid JWT token (manual corruption)
- Expired JWT token (automatic redirect)
- Backend unreachable (server stopped)

### Success Criteria Validation

Verify all 10 success criteria from spec.md:
- SC-001: Task list loads < 2s (measure with Network tab)
- SC-002: Task creation < 1s (measure with Performance tab)
- SC-003: Toggle completion < 500ms (measure with Performance tab)
- SC-004: Better Auth flows work
- SC-005: All API requests include JWT (verify in Network tab)
- SC-006: Error messages display
- SC-007: Auto-update without refresh
- SC-008: Responsive 320px-1920px
- SC-009: Full workflow completable
- SC-010: Auth state persists

---

## Implementation Sequence

**Order**: Follow user story priorities (P1 MVP → P2 → P3)

### Phase 2A: P1 MVP - Core Infrastructure (⏳ Next)

**User Story**: Foundation for all features

**Tasks**:
1. Initialize Next.js 16+ project with TypeScript + Tailwind
2. Configure Better Auth React SDK and SessionProvider
3. Create middleware.ts for route protection
4. Set up project structure (app/, components/, lib/, hooks/)
5. Implement authenticatedFetch() wrapper
6. Create TypeScript types (lib/api/types.ts from data-model.md)
7. Implement API client functions (lib/api/tasks.ts)
8. Create root layout with SessionProvider
9. Create authentication pages (login, signup)

**Deliverables**:
- Working Next.js app with authentication
- Protected /tasks route
- API client ready for use

---

### Phase 2B: P1 MVP - View Task List

**User Story 1**: As an authenticated user, I want to see all my tasks

**Tasks**:
1. Create useTasks() hook with fetchTasks()
2. Create TaskList component (empty state, loading state, error state)
3. Create TaskItem component (display title, completion state, date)
4. Implement formatTaskDate() for relative dates
5. Create /tasks page using useTasks() hook
6. Test empty state, loading state, error state
7. Test responsive layout (mobile, tablet, desktop)

**Deliverables**:
- Task list view with loading/empty/error states
- Responsive layout across all screen sizes

---

### Phase 2C: P1 MVP - Create New Tasks

**User Story 2**: As an authenticated user, I want to create new tasks

**Tasks**:
1. Implement validateTaskTitle() and sanitizeTaskTitle()
2. Create CreateTaskForm component with validation
3. Implement createTask() in useTasks() hook
4. Wire up form submit to createTask()
5. Handle loading state during creation
6. Display validation errors inline
7. Handle API errors with retry
8. Test validation scenarios (empty, whitespace, max length)
9. Test API error handling
10. Verify auto-update after creation

**Deliverables**:
- Task creation form with validation
- Auto-update task list on success
- Error handling with user-friendly messages

---

### Phase 2D: P2 - Toggle Task Completion

**User Story 3**: As an authenticated user, I want to mark tasks complete/incomplete

**Tasks**:
1. Implement toggleTask() in useTasks() with optimistic updates
2. Add checkbox to TaskItem component
3. Implement visual completion state (strikethrough, color change)
4. Implement rollback on API error
5. Test optimistic update behavior
6. Test rollback on network failure
7. Verify performance < 500ms (SC-003)
8. Test persistence after page refresh

**Deliverables**:
- Toggle completion with optimistic updates
- Visual completion state
- Rollback on error

---

### Phase 2E: P3 - Update Task Titles

**User Story 4**: As an authenticated user, I want to edit task titles

**Tasks**:
1. Create EditTaskForm component (inline edit mode)
2. Implement updateTask() in useTasks() hook
3. Add edit button to TaskItem
4. Implement edit mode state (show/hide input)
5. Reuse validateTaskTitle() for edit validation
6. Implement cancel edit (revert to original)
7. Test validation scenarios
8. Test API error handling
9. Verify auto-update after edit

**Deliverables**:
- Inline task title editing
- Validation and error handling
- Cancel functionality

---

### Phase 2F: P3 - Delete Tasks

**User Story 5**: As an authenticated user, I want to delete tasks

**Tasks**:
1. Implement deleteTask() in useTasks() hook
2. Add delete button to TaskItem
3. Implement confirmation dialog/modal
4. Handle delete success (remove from list)
5. Handle delete error (show message, keep in list)
6. Test confirmation flow (confirm and cancel)
7. Test API error handling
8. Verify deletion persists after refresh

**Deliverables**:
- Delete functionality with confirmation
- Error handling
- Auto-update task list

---

### Phase 2G: Polish & Validation (⏳ Final)

**Tasks**:
1. Run full testing suite from quickstart.md
2. Validate all 10 success criteria
3. Test all user stories independently
4. Fix any bugs or UX issues
5. Optimize performance if needed
6. Verify responsive design on real devices
7. Check accessibility basics (keyboard navigation, ARIA)
8. Update README.md with setup instructions
9. Create .env.example template
10. Final constitutional compliance check

**Deliverables**:
- Fully functional frontend application
- All success criteria met
- Ready for hackathon demo

---

## Environment Configuration

### Required Environment Variables

**.env.local** (frontend):
```bash
# Backend API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Better Auth configuration
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth

# Better Auth secret (shared with backend)
BETTER_AUTH_SECRET=your-secret-key-here
```

### Production Configuration

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com/api/auth
BETTER_AUTH_SECRET=<production-secret>
```

---

## Dependencies

### npm Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "better-auth": "latest",
    "tailwindcss": "latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "autoprefixer": "latest",
    "postcss": "latest",
    "eslint": "latest",
    "eslint-config-next": "^16.0.0"
  }
}
```

### External Dependencies (Spec Dependencies)

- **Spec 001**: Better Auth (authentication, JWT token issuance)
- **Spec 002**: Backend API (task CRUD endpoints, user authentication)
- **Neon PostgreSQL**: Database via Backend API (Spec 002)

---

## Deployment Considerations

### Build Process

```bash
npm run build   # Production build
npm start       # Production server
```

### Environment Setup

1. Configure production environment variables
2. Ensure HTTPS enabled (frontend and backend)
3. Configure CORS on backend for production frontend URL
4. Set up Better Auth for production domain
5. Verify JWT secret shared between frontend and backend

### Performance Optimization

- Next.js automatic optimizations (code splitting, image optimization)
- Tailwind CSS purges unused styles in production
- Static asset caching via Next.js
- Server-side rendering for initial page load

### Security Checklist

- ✅ Environment secrets stored securely (not committed)
- ✅ HTTPS enforced in production
- ✅ CORS configured correctly
- ✅ JWT tokens transmitted securely
- ✅ No sensitive data logged
- ✅ Error messages generic (no stack traces to users)

---

## Risks and Mitigations

### Risk 1: Better Auth Integration Issues

**Risk**: Better Auth SDK integration may have unexpected behavior with Next.js 16 App Router

**Likelihood**: Medium | **Impact**: High

**Mitigation**:
- Research.md documents proven integration pattern
- Use official Better Auth React SDK (well-tested)
- Test authentication flows early (Phase 2A)
- Fallback: Manual JWT token management if SDK fails

---

### Risk 2: JWT Token Mismatch Between Better Auth and Backend

**Risk**: JWT tokens from Better Auth may not be compatible with FastAPI backend verification

**Likelihood**: Low | **Impact**: High

**Mitigation**:
- Shared BETTER_AUTH_SECRET between frontend and backend
- Document JWT token format in contracts/
- Test authentication flow end-to-end early
- Coordinate with Spec 002 backend implementation

---

### Risk 3: Performance Targets Not Met

**Risk**: Page load or operation response times exceed success criteria (2s, 1s, 500ms)

**Likelihood**: Low | **Impact**: Medium

**Mitigation**:
- Optimistic updates for perceived performance (SC-003)
- Next.js automatic optimizations (code splitting, caching)
- Tailwind CSS production build purges unused styles
- Measure performance continuously during development

---

### Risk 4: Responsive Design Issues on Real Devices

**Risk**: Tailwind responsive utilities may not work as expected on all devices

**Likelihood**: Low | **Impact**: Medium

**Mitigation**:
- Mobile-first approach ensures base experience works
- Test on physical devices (not just DevTools emulation)
- Tailwind breakpoints are industry-standard
- Quickstart.md includes responsive testing checklist

---

## Success Metrics

### Feature Completeness

- ✅ All 5 user stories implemented (P1 MVP + P2 + P3)
- ✅ All 20 functional requirements satisfied
- ✅ All 10 success criteria met

### Performance Metrics

- ✅ Page load < 2 seconds (SC-001)
- ✅ Task creation < 1 second (SC-002)
- ✅ Toggle completion < 500ms (SC-003)

### Quality Metrics

- ✅ Zero critical bugs
- ✅ No security vulnerabilities
- ✅ Responsive on all target screen sizes
- ✅ Error handling for all failure scenarios

### Constitutional Compliance

- ✅ All code generated via `nextjs-frontend-builder` agent
- ✅ No manual coding
- ✅ All artifacts traceable and reviewable
- ✅ Follows spec-driven workflow
- ✅ Security-first architecture enforced

---

## Next Steps

1. **Review and approve this plan** ✅
2. **Run `/sp.tasks`** to generate actionable task list
3. **Run `/sp.implement`** to execute tasks via specialized agents
4. **Test** using quickstart.md testing guide
5. **Validate** against success criteria and constitution
6. **Commit** incrementally with clear messages
7. **Create PR** linking to spec and tasks

---

**Plan Status**: ✅ Complete and ready for tasks generation
**Constitutional Compliance**: ✅ Passed all gates
**Research Status**: ✅ All technical unknowns resolved
**Design Status**: ✅ Data model and contracts complete
**Next Command**: `/sp.tasks` to generate task list

---

*Generated via `/sp.plan` command on 2026-02-07*
