# API Client Contract

**Feature**: 003-frontend-integration
**Date**: 2026-02-06
**Purpose**: Define API integration layer for backend communication

---

## Overview

This document specifies the TypeScript API client that provides a clean interface for frontend components to interact with the Backend API (Spec 002). The client handles authentication, error handling, and type-safe request/response serialization.

**Backend API**: Spec 002 - Backend API & Data Layer
**Base URL**: Configured via `NEXT_PUBLIC_API_BASE_URL` environment variable
**Authentication**: JWT Bearer tokens from Better Auth (Spec 001)

---

## Base Configuration

### Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### API Base URL

```typescript
// lib/api/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
```

---

## HTTP Client

### Authenticated Fetch Wrapper

```typescript
// lib/api/client.ts
import { getSession, signOut } from 'better-auth/react';
import { API_BASE_URL } from './config';

/**
 * Custom API error with HTTP status code
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail);
    this.name = 'APIError';
  }
}

/**
 * Authenticated fetch wrapper
 *
 * Automatically:
 * - Retrieves JWT token from Better Auth session
 * - Adds Authorization header
 * - Handles authentication failures (401 → redirect to login)
 * - Handles authorization failures (403 → throw error)
 * - Parses error responses
 *
 * @param endpoint - API endpoint path (e.g., "/api/tasks")
 * @param options - Standard fetch options
 * @returns Response object
 * @throws APIError on HTTP errors
 */
export async function authenticatedFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  // Get JWT token from Better Auth session
  const session = await getSession();
  const token = session?.access_token;

  // Redirect to login if no token
  if (!token) {
    window.location.href = '/login';
    throw new APIError(401, 'Not authenticated');
  }

  // Make request with authentication header
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  // Handle authentication failure (expired/invalid token)
  if (response.status === 401) {
    await signOut(); // Clear invalid session
    window.location.href = '/login';
    throw new APIError(401, 'Session expired. Please log in again.');
  }

  // Handle other HTTP errors
  if (!response.ok) {
    let errorDetail: string;
    try {
      const errorData = await response.json();
      errorDetail = typeof errorData.detail === 'string'
        ? errorData.detail
        : JSON.stringify(errorData.detail);
    } catch {
      errorDetail = `HTTP ${response.status}: ${response.statusText}`;
    }

    throw new APIError(response.status, errorDetail);
  }

  return response;
}
```

---

## Task API Functions

### Get Tasks (List)

```typescript
/**
 * Fetch all tasks for the authenticated user
 *
 * Endpoint: GET /api/tasks
 * Auth: Required (JWT)
 * Success: 200 OK with Task[]
 * Errors:
 *   - 401: Not authenticated
 *
 * @returns Array of tasks ordered by created_at descending (newest first)
 * @throws APIError on failure
 */
export async function getTasks(): Promise<Task[]> {
  const response = await authenticatedFetch('/api/tasks');
  const tasks: Task[] = await response.json();
  return tasks;
}
```

**Example Usage**:
```typescript
try {
  const tasks = await getTasks();
  console.log(`Loaded ${tasks.length} tasks`);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`Failed to load tasks: ${error.detail}`);
  }
}
```

---

### Create Task

```typescript
/**
 * Create a new task
 *
 * Endpoint: POST /api/tasks
 * Auth: Required (JWT)
 * Request Body: { title: string }
 * Success: 201 Created with Task
 * Errors:
 *   - 400: Invalid title (empty, whitespace, too long)
 *   - 401: Not authenticated
 *   - 422: Validation error
 *
 * @param data - Task creation data
 * @returns Created task with id, timestamps, etc.
 * @throws APIError on failure
 */
export async function createTask(data: TaskCreateRequest): Promise<Task> {
  const response = await authenticatedFetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const task: Task = await response.json();
  return task;
}
```

**Example Usage**:
```typescript
try {
  const newTask = await createTask({ title: 'Buy groceries' });
  console.log(`Created task: ${newTask.id}`);
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 400) {
      console.error('Invalid title:', error.detail);
    }
  }
}
```

---

### Toggle Task Completion

```typescript
/**
 * Toggle task completion status
 *
 * Endpoint: PATCH /api/tasks/{id}
 * Auth: Required (JWT)
 * Request Body: { completed: boolean }
 * Success: 200 OK with updated Task
 * Errors:
 *   - 401: Not authenticated
 *   - 403: Task belongs to different user
 *   - 404: Task not found
 *   - 422: Invalid UUID format
 *
 * @param id - Task ID (UUID)
 * @param data - New completion status
 * @returns Updated task
 * @throws APIError on failure
 */
export async function toggleTask(
  id: string,
  data: TaskToggleRequest
): Promise<Task> {
  const response = await authenticatedFetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  const task: Task = await response.json();
  return task;
}
```

**Example Usage**:
```typescript
try {
  const updated = await toggleTask(taskId, { completed: true });
  console.log(`Task ${updated.id} marked as complete`);
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 404) {
      console.error('Task not found');
    } else if (error.status === 403) {
      console.error('You do not have permission to modify this task');
    }
  }
}
```

---

### Update Task Title

```typescript
/**
 * Update task title
 *
 * Endpoint: PUT /api/tasks/{id}
 * Auth: Required (JWT)
 * Request Body: { title: string }
 * Success: 200 OK with updated Task
 * Errors:
 *   - 400: Invalid title (empty, whitespace, too long)
 *   - 401: Not authenticated
 *   - 403: Task belongs to different user
 *   - 404: Task not found
 *   - 422: Invalid UUID format
 *
 * @param id - Task ID (UUID)
 * @param data - New title
 * @returns Updated task
 * @throws APIError on failure
 */
export async function updateTask(
  id: string,
  data: TaskUpdateRequest
): Promise<Task> {
  const response = await authenticatedFetch(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  const task: Task = await response.json();
  return task;
}
```

**Example Usage**:
```typescript
try {
  const updated = await updateTask(taskId, { title: 'Updated task title' });
  console.log(`Task title updated to: ${updated.title}`);
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 400) {
      console.error('Invalid title:', error.detail);
    }
  }
}
```

---

### Delete Task

```typescript
/**
 * Delete a task permanently
 *
 * Endpoint: DELETE /api/tasks/{id}
 * Auth: Required (JWT)
 * Success: 204 No Content
 * Errors:
 *   - 401: Not authenticated
 *   - 403: Task belongs to different user
 *   - 404: Task not found
 *   - 422: Invalid UUID format
 *
 * @param id - Task ID (UUID)
 * @returns void (no response body)
 * @throws APIError on failure
 */
export async function deleteTask(id: string): Promise<void> {
  await authenticatedFetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });

  // 204 No Content - no response body to parse
}
```

**Example Usage**:
```typescript
try {
  await deleteTask(taskId);
  console.log('Task deleted successfully');
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 404) {
      console.error('Task not found');
    } else if (error.status === 403) {
      console.error('You do not have permission to delete this task');
    }
  }
}
```

---

## Error Handling

### Error Types

```typescript
/**
 * Check if error is an API error
 */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

/**
 * Extract user-friendly error message
 *
 * @param error - Error from API call
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isAPIError(error)) {
    return error.detail;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
```

### Error Code Mapping

```typescript
/**
 * Map HTTP status code to user-friendly message
 *
 * @param status - HTTP status code
 * @returns Generic user-friendly message
 */
export function getStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid input. Please check your data and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested item could not be found.';
    case 422:
      return 'The data format is invalid. Please try again.';
    case 500:
      return 'A server error occurred. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}
```

---

## Module Structure

```typescript
// lib/api/index.ts - Main export point
export {
  getTasks,
  createTask,
  toggleTask,
  updateTask,
  deleteTask,
} from './tasks';

export {
  authenticatedFetch,
  APIError,
  isAPIError,
  getErrorMessage,
  getStatusMessage,
} from './client';

export {
  API_BASE_URL,
} from './config';

export type {
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskToggleRequest,
  TaskListResponse,
  APIErrorResponse,
} from './types';
```

**File Organization**:
```
lib/api/
├── index.ts           # Main export point
├── config.ts          # Environment configuration
├── client.ts          # authenticatedFetch + error handling
├── tasks.ts           # Task CRUD functions
└── types.ts           # TypeScript types (from data-model.md)
```

---

## Testing Considerations

### Manual Testing via Browser DevTools

```typescript
// Example: Test getTasks in browser console
import { getTasks } from '@/lib/api';

getTasks()
  .then(tasks => console.log('Tasks:', tasks))
  .catch(error => console.error('Error:', error));
```

### Network Error Simulation

```typescript
// Simulate network failure
const originalFetch = window.fetch;
window.fetch = () => Promise.reject(new Error('Network failure'));

// Test error handling
getTasks().catch(error => console.log('Caught:', error.message));

// Restore fetch
window.fetch = originalFetch;
```

### 401 Redirect Testing

```typescript
// Should redirect to /login when token is invalid
// Test by manually clearing Better Auth session then calling API
signOut();
getTasks(); // Should redirect to /login
```

---

## Integration with Backend (Spec 002)

### Endpoint Mapping

| Frontend Function | Backend Endpoint | HTTP Method | Auth |
|-------------------|------------------|-------------|------|
| `getTasks()` | `GET /api/tasks` | GET | Required |
| `createTask()` | `POST /api/tasks` | POST | Required |
| `toggleTask()` | `PATCH /api/tasks/{id}` | PATCH | Required |
| `updateTask()` | `PUT /api/tasks/{id}` | PUT | Required |
| `deleteTask()` | `DELETE /api/tasks/{id}` | DELETE | Required |

### Request/Response Alignment

| Frontend Type | Backend Schema | Alignment |
|---------------|----------------|-----------|
| `TaskCreateRequest` | `TaskCreate` | ✅ Exact match |
| `TaskUpdateRequest` | `TaskUpdate` | ✅ Exact match |
| `TaskToggleRequest` | `TaskToggle` | ✅ Exact match |
| `Task` | `TaskResponse` | ✅ Exact match |

### Error Code Alignment

| HTTP Status | Backend | Frontend Handling |
|-------------|---------|-------------------|
| 200 OK | Success | Parse response, return data |
| 201 Created | Task created | Parse response, return task |
| 204 No Content | Task deleted | No response body, return void |
| 400 Bad Request | Validation error | Throw APIError with detail |
| 401 Unauthorized | Missing/invalid token | Redirect to /login |
| 403 Forbidden | Unauthorized access | Throw APIError, show error |
| 404 Not Found | Task not found | Throw APIError, show error |
| 422 Unprocessable | Invalid UUID | Throw APIError, show error |
| 500 Server Error | Internal error | Throw APIError, generic message |

---

## Security Considerations

### JWT Token Handling

- ✅ Token retrieved from Better Auth session (secure storage)
- ✅ Token included in Authorization header (not URL parameters)
- ✅ Token never logged or exposed in error messages
- ✅ Invalid token triggers logout and redirect

### CORS Configuration

Backend must allow frontend origin:
```python
# Backend CORS config (already in Spec 002)
allow_origins=[settings.FRONTEND_URL]
allow_credentials=True
allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE"]
allow_headers=["Content-Type", "Authorization"]
```

Frontend requests automatically include credentials via `fetch` defaults.

### Secrets Protection

- ✅ API base URL in environment variables (not hardcoded)
- ✅ Better Auth config in environment variables
- ✅ No secrets committed to version control

---

**API Client Contract Status**: ✅ Complete
**Backend Integration**: ✅ Aligned with Spec 002
**Next**: Quickstart Guide (quickstart.md)
