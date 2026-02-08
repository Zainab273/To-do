# Feature Specification: Backend API & Data Layer for Todo Application

**Feature Branch**: `002-backend-api-data`
**Created**: 2026-02-05
**Status**: Draft
**Input**: User description: "Backend API & Data Layer for Todo Full-Stack Web Application"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create New Tasks via API (Priority: P1)

Authenticated users need to create new todo tasks through a REST API endpoint that validates input, enforces user ownership, and persists data to the database.

**Why this priority**: This is the foundation of task management - users cannot interact with tasks until they can create them. This is the highest-value feature that must work first.

**Independent Test**: Can be fully tested by sending a POST request with authentication token and task title, then verifying the task is created in the database with correct user ownership and timestamp. Delivers immediate value by allowing users to add tasks.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user with a valid JWT token, **When** I POST to `/api/tasks` with `{"title": "Buy groceries"}`, **Then** a new task is created with my user_id, the provided title, completed=false, and a creation timestamp
2. **Given** I am an authenticated user, **When** I POST to `/api/tasks` with an empty or whitespace-only title, **Then** I receive a 400 Bad Request with error message "Task title is required"
3. **Given** I am an authenticated user, **When** I POST to `/api/tasks` with a title exceeding 500 characters, **Then** I receive a 400 Bad Request with error message "Task title must be 500 characters or less"
4. **Given** I am not authenticated, **When** I POST to `/api/tasks`, **Then** I receive a 401 Unauthorized error
5. **Given** I am an authenticated user, **When** I POST to `/api/tasks` with a valid title, **Then** the response includes the complete task object with id, title, completed status, user_id, and timestamps

---

### User Story 2 - Retrieve User's Task List via API (Priority: P1)

Authenticated users need to retrieve their complete list of tasks through a REST API endpoint that enforces user isolation and returns tasks in a consistent order.

**Why this priority**: Users must be able to see their tasks immediately after creating them. This pairs with P1 creation to form the minimal viable task management system.

**Independent Test**: Can be fully tested by creating multiple tasks for different users, then verifying GET requests return only the authenticated user's tasks in the correct order. Delivers value by showing users their todo list.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user with 5 existing tasks, **When** I GET `/api/tasks`, **Then** I receive a JSON array of exactly my 5 tasks, ordered by creation date (newest first)
2. **Given** I am an authenticated user, **When** I GET `/api/tasks` and another user has tasks in the database, **Then** I only see my tasks, never tasks owned by other users
3. **Given** I am an authenticated user with no tasks, **When** I GET `/api/tasks`, **Then** I receive an empty array `[]`
4. **Given** I am not authenticated, **When** I GET `/api/tasks`, **Then** I receive a 401 Unauthorized error
5. **Given** I am an authenticated user, **When** I GET `/api/tasks`, **Then** each task object includes id, title, completed, user_id, created_at, and updated_at fields

---

### User Story 3 - Toggle Task Completion Status via API (Priority: P2)

Authenticated users need to update a task's completion status through a REST API endpoint that validates ownership and persists the change.

**Why this priority**: After users can create and view tasks (P1), marking tasks complete/incomplete is the next most valuable action. This enables progress tracking.

**Independent Test**: Can be fully tested by creating a task, sending PATCH requests to toggle completion status, and verifying the database reflects the changes. Delivers value by allowing users to track task completion.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user with a task that has completed=false, **When** I PATCH `/api/tasks/{task_id}` with `{"completed": true}`, **Then** the task's completed status is updated to true and updated_at timestamp is refreshed
2. **Given** I am an authenticated user with a task that has completed=true, **When** I PATCH `/api/tasks/{task_id}` with `{"completed": false}`, **Then** the task's completed status is updated to false and updated_at timestamp is refreshed
3. **Given** I am an authenticated user, **When** I PATCH `/api/tasks/{task_id}` for a task owned by another user, **Then** I receive a 403 Forbidden error
4. **Given** I am an authenticated user, **When** I PATCH `/api/tasks/{invalid_id}`, **Then** I receive a 404 Not Found error
5. **Given** I am not authenticated, **When** I PATCH `/api/tasks/{task_id}`, **Then** I receive a 401 Unauthorized error

---

### User Story 4 - Update Task Title via API (Priority: P3)

Authenticated users need to edit the title of existing tasks through a REST API endpoint that validates ownership, enforces validation rules, and persists changes.

**Why this priority**: Task editing is important but less critical than creation, viewing, and completion toggling. Users can work around missing edit by deleting and recreating tasks.

**Independent Test**: Can be fully tested by creating a task, sending a PUT request with a new title, and verifying the database reflects the updated title. Delivers convenience for users to correct or refine task descriptions.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user with an existing task, **When** I PUT `/api/tasks/{task_id}` with `{"title": "Updated task title"}`, **Then** the task's title is updated and updated_at timestamp is refreshed
2. **Given** I am an authenticated user, **When** I PUT `/api/tasks/{task_id}` with an empty or whitespace-only title, **Then** I receive a 400 Bad Request with error message "Task title is required"
3. **Given** I am an authenticated user, **When** I PUT `/api/tasks/{task_id}` for a task owned by another user, **Then** I receive a 403 Forbidden error
4. **Given** I am an authenticated user, **When** I PUT `/api/tasks/{task_id}` with a title exceeding 500 characters, **Then** I receive a 400 Bad Request with error message "Task title must be 500 characters or less"
5. **Given** I am not authenticated, **When** I PUT `/api/tasks/{task_id}`, **Then** I receive a 401 Unauthorized error

---

### User Story 5 - Delete Tasks via API (Priority: P3)

Authenticated users need to permanently delete tasks through a REST API endpoint that validates ownership and removes the record from the database.

**Why this priority**: Task deletion is useful but lowest priority - users can leave unwanted tasks incomplete as a workaround. The core value is creating and completing tasks.

**Independent Test**: Can be fully tested by creating a task, sending a DELETE request, and verifying the task no longer exists in the database or subsequent GET requests. Delivers cleanup capability for users.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user with an existing task, **When** I DELETE `/api/tasks/{task_id}`, **Then** the task is permanently removed from the database and I receive a 204 No Content response
2. **Given** I am an authenticated user, **When** I DELETE `/api/tasks/{task_id}` for a task owned by another user, **Then** I receive a 403 Forbidden error and the task is not deleted
3. **Given** I am an authenticated user, **When** I DELETE `/api/tasks/{invalid_id}`, **Then** I receive a 404 Not Found error
4. **Given** I am not authenticated, **When** I DELETE `/api/tasks/{task_id}`, **Then** I receive a 401 Unauthorized error
5. **Given** I am an authenticated user who deletes a task, **When** I subsequently GET `/api/tasks`, **Then** the deleted task does not appear in the response

---

### Edge Cases

- What happens when a user tries to create a task with special characters (emojis, unicode) in the title?
- How does the system handle concurrent updates to the same task (two PATCH requests updating completion status simultaneously)?
- What happens when a user's JWT token expires mid-request?
- How does the system handle database connection failures during task operations?
- What happens when a user tries to update a task that was just deleted by the same user in another browser tab?
- How does the system handle very long titles that approach but don't exceed the 500 character limit?
- What happens if the database has orphaned tasks (tasks with user_id that no longer exists in users table)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a POST endpoint at `/api/tasks` that accepts authenticated requests with task title and creates a new task record
- **FR-002**: System MUST validate task titles are non-empty, non-whitespace, and 500 characters or less
- **FR-003**: System MUST automatically associate created tasks with the authenticated user's ID from the JWT token
- **FR-004**: System MUST provide a GET endpoint at `/api/tasks` that returns only tasks owned by the authenticated user
- **FR-005**: System MUST order task lists by creation date with newest tasks first
- **FR-006**: System MUST provide a PATCH endpoint at `/api/tasks/{task_id}` that updates task completion status
- **FR-007**: System MUST provide a PUT endpoint at `/api/tasks/{task_id}` that updates task title with validation
- **FR-008**: System MUST provide a DELETE endpoint at `/api/tasks/{task_id}` that permanently removes tasks
- **FR-009**: System MUST enforce user ownership validation on all update and delete operations, returning 403 Forbidden for unauthorized access attempts
- **FR-010**: System MUST return 404 Not Found when operations reference non-existent task IDs
- **FR-011**: System MUST return 401 Unauthorized for all endpoints when JWT token is missing, invalid, or expired
- **FR-012**: System MUST automatically update the `updated_at` timestamp whenever a task is modified
- **FR-013**: System MUST persist all task data to the Neon PostgreSQL database
- **FR-014**: System MUST use the existing JWT middleware for authentication on all task endpoints
- **FR-015**: System MUST return appropriate HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500) based on operation outcomes
- **FR-016**: System MUST handle database errors gracefully and return 500 Internal Server Error with generic error messages to clients
- **FR-017**: System MUST validate that task_id parameters are valid UUIDs, returning 400 Bad Request for invalid formats
- **FR-018**: System MUST use the existing Task SQLModel for database operations
- **FR-019**: System MUST ensure concurrent requests do not create data inconsistencies through proper transaction handling
- **FR-020**: System MUST sanitize user input to prevent SQL injection and other injection attacks

### Key Entities

- **Task**: Represents a todo item with title (string, max 500 chars), completion status (boolean), ownership (user_id UUID foreign key), creation timestamp, and update timestamp. Each task belongs to exactly one user.
- **User**: Existing entity from authentication feature. Tasks reference users via user_id foreign key to enforce ownership and enable user-scoped queries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new task and see it in their task list within 2 seconds
- **SC-002**: Users can retrieve their complete task list (up to 100 tasks) within 1 second
- **SC-003**: Users can toggle a task's completion status and see the update within 1 second
- **SC-004**: Users can update a task title and see the change within 1 second
- **SC-005**: Users can delete a task and confirm its removal from their list within 1 second
- **SC-006**: System correctly enforces user isolation - 100% of task operations only affect the authenticated user's tasks
- **SC-007**: System handles concurrent task operations from the same user without data loss or corruption
- **SC-008**: All task operations maintain data integrity with proper validation - 0% of invalid data persisted to database
- **SC-009**: API endpoints return correct HTTP status codes for all scenarios (success, validation errors, auth errors, not found)
- **SC-010**: System handles database connection failures gracefully without exposing internal errors to users
