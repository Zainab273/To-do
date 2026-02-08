# Data Model: Frontend Application & Integration

**Feature**: 003-frontend-integration
**Date**: 2026-02-06
**Purpose**: Define frontend TypeScript types and data structures

---

## Overview

This document defines the frontend data model for the Next.js task management application. All types mirror the backend Pydantic schemas defined in Spec 002 to ensure end-to-end type safety and correctness.

**Source of Truth**: Backend API schemas (Spec 002 - specs/002-backend-api-data/contracts/openapi.yaml)

---

## Core Entities

### Task

The primary entity representing a user's todo item.

```typescript
/**
 * Task entity - represents a user's todo item
 *
 * Matches backend TaskResponse schema from Spec 002
 * @see specs/002-backend-api-data/contracts/openapi.yaml#/components/schemas/TaskResponse
 */
export interface Task {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Task title (1-500 characters, trimmed, non-empty) */
  title: string;

  /** Completion status */
  completed: boolean;

  /** Owner user ID (UUID v4) - matches authenticated user from JWT */
  user_id: string;

  /** Creation timestamp (ISO 8601 format) */
  created_at: string;

  /** Last update timestamp (ISO 8601 format) */
  updated_at: string;
}
```

**Field Constraints**:
- `id`: UUID v4 format, immutable
- `title`: 1-500 characters, trimmed whitespace, cannot be empty or whitespace-only
- `completed`: Boolean only
- `user_id`: UUID v4 format, matches JWT token user
- `created_at`: ISO 8601 datetime string (e.g., "2026-02-06T10:30:00Z")
- `updated_at`: ISO 8601 datetime string, updated on every modification

**State Transitions**:
- Task is created with `completed = false`
- `completed` can be toggled between `true` and `false`
- `title` can be updated any time
- `updated_at` refreshes on toggle or title update
- Task can be deleted (permanent removal)

**Relationships**:
- **User** (one-to-many): Each task belongs to exactly one user (`user_id`)
- Tasks are scoped to authenticated user - frontend never sees other users' tasks

---

## Request Types

### TaskCreateRequest

Request payload for creating a new task.

```typescript
/**
 * Request to create a new task
 *
 * Matches backend TaskCreate schema from Spec 002
 * @see specs/002-backend-api-data/contracts/openapi.yaml#/components/schemas/TaskCreate
 */
export interface TaskCreateRequest {
  /** Task title - will be trimmed and validated */
  title: string;
}
```

**Validation Rules** (client-side):
1. Title must be trimmed of leading/trailing whitespace
2. After trimming, length must be 1-500 characters
3. Cannot be empty or consist only of whitespace
4. Frontend validates before sending to backend

**Example Valid Values**:
- `"Buy groceries"`
- `"  Write documentation  "` (trimmed to "Write documentation")
- `"A".repeat(500)` (exactly 500 characters)

**Example Invalid Values**:
- `""` (empty string)
- `"   "` (whitespace only)
- `"A".repeat(501)` (too long)

---

### TaskUpdateRequest

Request payload for updating a task's title.

```typescript
/**
 * Request to update task title
 *
 * Matches backend TaskUpdate schema from Spec 002
 * Same validation rules as TaskCreate
 * @see specs/002-backend-api-data/contracts/openapi.yaml#/components/schemas/TaskUpdate
 */
export interface TaskUpdateRequest {
  /** New task title - will be trimmed and validated */
  title: string;
}
```

**Validation Rules**: Identical to `TaskCreateRequest`

---

### TaskToggleRequest

Request payload for toggling task completion status.

```typescript
/**
 * Request to toggle task completion status
 *
 * Matches backend TaskToggle schema from Spec 002
 * @see specs/002-backend-api-data/contracts/openapi.yaml#/components/schemas/TaskToggle
 */
export interface TaskToggleRequest {
  /** New completion status */
  completed: boolean;
}
```

**Validation Rules**:
- Must be boolean type (true or false)
- No string conversions ("true" is invalid)

---

## Response Types

### Task List Response

Backend returns array of tasks directly (not wrapped in object).

```typescript
/**
 * Response from GET /api/tasks
 * Returns array of tasks ordered by created_at descending (newest first)
 */
export type TaskListResponse = Task[];
```

**Properties**:
- Always an array (empty array `[]` if user has no tasks)
- Tasks ordered by `created_at` descending (newest first)
- Only includes authenticated user's tasks

---

### API Error Response

Standard error response format from backend.

```typescript
/**
 * API error response format
 *
 * Matches FastAPI HTTPException detail structure
 */
export interface APIErrorResponse {
  /** Error detail message (string or validation error object) */
  detail: string | ValidationError;
}

/**
 * Validation error structure for 422 responses
 */
export interface ValidationError {
  [field: string]: string[];
}
```

**HTTP Status Codes**:
- `400 Bad Request`: Invalid input (e.g., empty title after trimming)
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Valid token but accessing another user's task
- `404 Not Found`: Task with given ID doesn't exist
- `422 Unprocessable Entity`: Invalid UUID format or validation failure
- `500 Internal Server Error`: Server-side failure

**Example Error Responses**:
```typescript
// 400 - Validation error
{
  "detail": "Task title cannot be empty or whitespace"
}

// 401 - Authentication error
{
  "detail": "Not authenticated"
}

// 403 - Authorization error
{
  "detail": "Access forbidden"
}

// 404 - Not found
{
  "detail": "Task not found"
}

// 422 - Invalid UUID
{
  "detail": "value is not a valid uuid"
}
```

---

## UI State Types

### Loading State

Tracks async operation state.

```typescript
/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

**State Transitions**:
- `idle`: Initial state, no operation attempted
- `loading`: Operation in progress
- `success`: Operation completed successfully
- `error`: Operation failed

---

### Tasks View State

Complete state for task list view.

```typescript
/**
 * State for task list view
 */
export interface TasksViewState {
  /** Array of tasks (empty if no tasks) */
  tasks: Task[];

  /** Loading state for initial fetch */
  loading: LoadingState;

  /** Error message if loading failed */
  error: string | null;

  /** Individual task operation states (for optimistic updates) */
  operationStates: {
    [taskId: string]: {
      toggling?: boolean;
      updating?: boolean;
      deleting?: boolean;
      error?: string;
    };
  };
}
```

**Usage**:
- `tasks`: Current task list (source of truth for UI)
- `loading`: Overall loading state (idle/loading/success/error)
- `error`: Global error message (e.g., failed to load tasks)
- `operationStates`: Per-task operation tracking for loading spinners and errors

---

## Validation Utilities

### Client-Side Validation

```typescript
/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate task title according to backend rules
 *
 * @param title - Raw title input from user
 * @returns Validation result with error message if invalid
 */
export function validateTaskTitle(title: string): ValidationResult {
  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Task title cannot be empty',
    };
  }

  if (trimmed.length > 500) {
    return {
      valid: false,
      error: 'Task title must be 500 characters or less',
    };
  }

  return { valid: true };
}

/**
 * Sanitize task title for submission
 *
 * @param title - Raw title input
 * @returns Trimmed title ready for API submission
 */
export function sanitizeTaskTitle(title: string): string {
  return title.trim();
}
```

---

## Date Formatting

### Display Formatting

```typescript
/**
 * Format ISO 8601 datetime for display
 *
 * @param isoString - ISO 8601 datetime (e.g., "2026-02-06T10:30:00Z")
 * @returns Human-readable date string
 */
export function formatTaskDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  // Less than 1 minute
  if (diffMins < 1) return 'just now';

  // Less than 1 hour
  if (diffMins < 60) return `${diffMins}m ago`;

  // Less than 24 hours
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  // Less than 7 days
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  // Absolute date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
```

**Examples**:
- `"2026-02-06T10:30:00Z"` (30 seconds ago) → `"just now"`
- `"2026-02-06T10:00:00Z"` (45 minutes ago) → `"45m ago"`
- `"2026-02-06T06:00:00Z"` (5 hours ago) → `"5h ago"`
- `"2026-02-05T10:00:00Z"` (yesterday) → `"1d ago"`
- `"2026-01-30T10:00:00Z"` (week ago) → `"Jan 30"`
- `"2025-12-15T10:00:00Z"` (different year) → `"Dec 15, 2025"`

---

## Type Exports

All types exported from central module.

```typescript
// lib/api/types.ts
export type {
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskToggleRequest,
  TaskListResponse,
  APIErrorResponse,
  ValidationError,
  LoadingState,
  TasksViewState,
  ValidationResult,
};

export {
  validateTaskTitle,
  sanitizeTaskTitle,
  formatTaskDate,
};
```

---

## Backend Schema Alignment

**Alignment Verification**:

| Frontend Type | Backend Schema | Status |
|---------------|----------------|--------|
| `Task` | `TaskResponse` | ✅ Matches (all 6 fields) |
| `TaskCreateRequest` | `TaskCreate` | ✅ Matches (title field + validation) |
| `TaskUpdateRequest` | `TaskUpdate` | ✅ Matches (title field + validation) |
| `TaskToggleRequest` | `TaskToggle` | ✅ Matches (completed boolean) |
| `TaskListResponse` | `GET /api/tasks` response | ✅ Matches (array of TaskResponse) |
| `APIErrorResponse` | FastAPI `HTTPException` | ✅ Matches (detail field) |

**Validation Alignment**:
- Title validation (1-500 chars, trimmed, non-empty): ✅ Matches backend FR-003
- UUID validation: ✅ Handled by backend (frontend sends strings)
- Completion toggle: ✅ Boolean only, matches backend

---

## Data Flow

### Create Task Flow
```
User Input → validateTaskTitle() → sanitizeTaskTitle() →
  TaskCreateRequest { title } → POST /api/tasks →
  Backend validates → Task created → TaskResponse → Task →
  Add to tasks array → UI updates
```

### Toggle Task Flow
```
User Click → Optimistic update (tasks array) →
  TaskToggleRequest { completed } → PATCH /api/tasks/{id} →
  Backend updates → TaskResponse → Task →
  Confirm update or rollback on error → UI reflects final state
```

### Update Task Flow
```
User Edit → validateTaskTitle() → sanitizeTaskTitle() →
  TaskUpdateRequest { title } → PUT /api/tasks/{id} →
  Backend updates → TaskResponse → Task →
  Replace in tasks array → UI updates
```

### Delete Task Flow
```
User Confirm → DELETE /api/tasks/{id} →
  Backend deletes → 204 No Content →
  Remove from tasks array → UI updates
```

---

**Data Model Status**: ✅ Complete
**Alignment Status**: ✅ Verified with Backend (Spec 002)
**Next**: API Contracts (contracts/api-client.ts)
