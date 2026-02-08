# Data Model: Backend API & Data Layer

**Feature**: Backend API & Data Layer for Todo Application
**Branch**: 002-backend-api-data
**Date**: 2026-02-05
**Purpose**: Document entities, relationships, and database schema for task management

## Overview

This feature leverages existing database models (User, Task) created during the authentication feature (001-multi-user-todo-auth). No new entities are required; this document describes how existing models support the task management API.

## Entities

### Task (Primary Entity)

**Purpose**: Represents a todo item owned by a single user

**Location**: `backend/src/models/task.py` (already exists)

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    user_id: UUID = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(max_length=500, nullable=False)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
```

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL, Default: uuid4() | Unique identifier for the task |
| `user_id` | UUID | FOREIGN KEY → users.id, NOT NULL, INDEXED | Owner of the task (enforces user isolation) |
| `title` | str | NOT NULL, MAX LENGTH 500 | Task description/title |
| `completed` | bool | NOT NULL, DEFAULT false | Completion status (false = incomplete, true = complete) |
| `created_at` | datetime | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When the task was created (UTC) |
| `updated_at` | datetime | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last modification timestamp (UTC) |

**Indexes**:
- PRIMARY KEY on `id` (automatic)
- INDEX on `user_id` (for efficient user-scoped queries)

**Constraints**:
- FOREIGN KEY: `user_id` REFERENCES `users(id)`
- NOT NULL on all fields
- Title length: 1-500 characters (validated at API layer)

**State Transitions**:
- `completed`: `false` ↔ `true` (can toggle back and forth)
- `updated_at`: automatically updated when any field changes

---

### User (Referenced Entity)

**Purpose**: Represents an authenticated user who owns tasks

**Location**: `backend/src/models/user.py` (already exists)

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    hashed_password: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
```

**Relationship to Task**:
- One User → Many Tasks (one-to-many)
- User can have 0 or more tasks
- Each task belongs to exactly one user
- Relationship enforced via `Task.user_id` foreign key

**Note**: User model is managed by the authentication feature (001). This feature only references User.id for ownership validation.

---

## Relationships

```text
┌─────────────────────┐
│       User          │
│                     │
│  id (PK, UUID)      │◄────┐
│  email              │     │
│  hashed_password    │     │
│  created_at         │     │
└─────────────────────┘     │
                             │
                             │ 1:N (one-to-many)
                             │
                             │
┌─────────────────────┐     │
│       Task          │     │
│                     │     │
│  id (PK, UUID)      │     │
│  user_id (FK) ──────┼─────┘
│  title              │
│  completed          │
│  created_at         │
│  updated_at         │
└─────────────────────┘
```

**Relationship Rules**:
- **Ownership**: Every task MUST have a user_id (NOT NULL constraint)
- **User Isolation**: Tasks are always queried/updated/deleted with `WHERE user_id = <authenticated_user_id>`
- **Cascading Deletes**: Not implemented (if user is deleted, tasks become orphaned - acceptable for MVP)
- **Foreign Key Integrity**: Database enforces that task.user_id must reference valid user.id

---

## Database Schema (SQL)

**Tasks Table** (from `backend/schema.sql`, already exists):

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

**Users Table** (from `backend/schema.sql`, already exists):

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

---

## Validation Rules

### Task Title Validation

**At API Layer** (Pydantic schema in `src/schemas/task.py`):
- MUST NOT be empty or whitespace-only
- MUST be between 1 and 500 characters
- Whitespace trimmed before saving

**Examples**:
- ✅ Valid: "Buy groceries"
- ✅ Valid: "Call mom 📞" (emojis allowed)
- ✅ Valid: "A" (single character)
- ❌ Invalid: "" (empty string) → 400 Bad Request
- ❌ Invalid: "   " (whitespace only) → 400 Bad Request
- ❌ Invalid: "A" * 501 (exceeds 500 chars) → 400 Bad Request

### Completed Validation

**Type**: Boolean only
- ✅ Valid: `true`, `false`
- ❌ Invalid: `null`, `"true"`, `1`, `0` → 422 Unprocessable Entity (Pydantic type error)

### User ID Validation

**Source**: Authenticated user from JWT token
- NEVER accept user_id from client request body or path
- ALWAYS extract from JWT via `get_current_user` middleware
- Enforce ownership on all read/update/delete operations

---

## Query Patterns

### Create Task
```python
task = Task(
    title=request.title,  # validated by Pydantic
    user_id=current_user_id,  # from JWT
    completed=False,  # default
    created_at=datetime.utcnow(),  # auto
    updated_at=datetime.utcnow()  # auto
)
session.add(task)
session.commit()
session.refresh(task)  # get auto-generated id
return task
```

### List User's Tasks (User-Scoped)
```python
tasks = session.exec(
    select(Task)
    .where(Task.user_id == current_user_id)
    .order_by(Task.created_at.desc())
).all()
return tasks
```

**Index Usage**: Query uses `idx_tasks_user_id` index for efficient filtering

### Get Single Task with Ownership Check
```python
task = session.get(Task, task_id)  # primary key lookup (efficient)
if not task:
    raise HTTPException(status_code=404, detail="Task not found")
if task.user_id != current_user_id:
    raise HTTPException(status_code=403, detail="Access forbidden")
return task
```

### Update Task Title
```python
task = get_task_with_ownership_check(...)  # see above
task.title = request.title
task.updated_at = datetime.utcnow()  # manual update
session.add(task)
session.commit()
session.refresh(task)
return task
```

### Toggle Task Completion
```python
task = get_task_with_ownership_check(...)
task.completed = request.completed
task.updated_at = datetime.utcnow()
session.add(task)
session.commit()
session.refresh(task)
return task
```

### Delete Task
```python
task = get_task_with_ownership_check(...)
session.delete(task)
session.commit()
# No return value (204 No Content)
```

---

## Performance Considerations

### Indexing Strategy

**Existing Indexes**:
- `tasks.id` (PRIMARY KEY) - used for single-task lookups
- `tasks.user_id` (INDEX) - used for list queries and ownership checks

**Query Performance**:
- List tasks for user: O(log n) index lookup + O(m) scan (m = tasks for user)
- Get single task: O(1) primary key lookup
- Update/delete: O(1) primary key lookup + O(log n) index update

**Scalability**:
- Up to 10,000 tasks per user: sub-second query times with proper indexing
- Neon PostgreSQL autoscaling handles concurrent users

### Timestamp Management

**Current Implementation**:
- `created_at`: Set once on insert (never changes)
- `updated_at`: Manually updated in application code

**Alternative** (not implemented):
- PostgreSQL trigger to auto-update `updated_at` on row change
- Tradeoff: Less control, slightly more complex schema

**Decision**: Manual `updated_at` management for simplicity and explicit control

---

## Data Integrity

### Constraints Enforced by Database

✅ **Primary Key**: Unique `id` for each task
✅ **Foreign Key**: `user_id` must reference valid user
✅ **Not Null**: All fields required (no NULL values)
✅ **Unique Email**: User emails are unique (prevents duplicate accounts)

### Constraints Enforced by Application

✅ **Title Length**: 1-500 characters (Pydantic validation)
✅ **User Ownership**: Only owner can read/update/delete task (API logic)
✅ **User Isolation**: List queries filtered by authenticated user (API logic)

### Invariants

**MUST hold at all times**:
1. Every task has a valid user_id (foreign key + NOT NULL)
2. Task.user_id matches the user who created it (no reassignment)
3. Authenticated user can only access their own tasks (no cross-user data)
4. Title is never empty or exceeds 500 characters
5. `updated_at` >= `created_at` for all tasks

---

## Migration Strategy

**No migrations needed** - Task and User models already exist in the database (created during feature 001-multi-user-todo-auth).

This feature only adds API endpoints that query/manipulate existing data.

---

## Entity Lifecycle

### Task Creation Flow
1. User authenticates → JWT issued (feature 001)
2. User sends POST /api/tasks with title
3. API validates title (Pydantic schema)
4. API creates Task with user_id from JWT
5. Database inserts row with auto-generated id and timestamps
6. API returns created task to user

### Task Update Flow
1. User sends PATCH/PUT with task_id and updates
2. API verifies JWT and extracts user_id
3. API queries task by id (primary key lookup)
4. API checks task.user_id == authenticated user_id
5. If mismatch: return 403 Forbidden
6. If match: apply updates, set updated_at, commit
7. API returns updated task

### Task Deletion Flow
1. User sends DELETE with task_id
2. API verifies JWT and extracts user_id
3. API queries task and checks ownership
4. If authorized: delete row from database
5. API returns 204 No Content

---

## Compliance with Constitution

### End-to-End Correctness ✅
- Task model matches spec requirements exactly
- Field names, types, and constraints align with API contracts
- Frontend types will match Task model structure

### Security-First Architecture ✅
- User ownership enforced via foreign key
- User isolation guaranteed by index on user_id
- No mechanism for cross-user data access

### Clear Separation of Concerns ✅
- Data layer (SQLModel) defines structure and persistence
- API layer enforces business rules (validation, ownership)
- No business logic in database models (pure data)

---

**Data Model Status**: ✅ **COMPLETE** - Ready for API contract definition.
