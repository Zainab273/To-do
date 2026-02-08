# Technical Research: Backend API & Data Layer

**Feature**: Backend API & Data Layer for Todo Application
**Branch**: 002-backend-api-data
**Date**: 2026-02-05
**Purpose**: Resolve technical unknowns and document best practices for FastAPI + SQLModel implementation

## Research Questions & Findings

### 1. FastAPI Dependency Injection for Database Sessions

**Question**: How should we manage database sessions in FastAPI endpoints to ensure proper cleanup and prevent connection leaks?

**Research Findings**:

FastAPI's dependency injection system provides automatic session lifecycle management through the `Depends()` mechanism.

**Recommended Pattern**:
```python
from typing import Generator
from sqlmodel import Session
from src.db.session import engine

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
```

**Usage in Endpoints**:
```python
@app.post("/api/tasks")
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    # session is automatically created and cleaned up
    ...
```

**Key Benefits**:
- Automatic session creation per request
- Automatic cleanup after request completes (even on exceptions)
- Connection pooling handled by SQLModel engine
- Compatible with Neon serverless PostgreSQL

**Decision**: Use `Depends(get_session)` in all endpoints. The existing `backend/src/db/session.py` already provides the engine; we just need to add the generator function.

---

### 2. User Ownership Validation Pattern

**Question**: Should ownership checks be centralized in a reusable dependency or implemented per-endpoint?

**Research Findings**:

Two approaches exist:

**Option A: Custom Dependency**
```python
def get_owned_task(
    task_id: UUID,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
) -> Task:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    return task

@app.delete("/api/tasks/{task_id}")
def delete_task(task: Task = Depends(get_owned_task)):
    # task is already validated
    ...
```

**Option B: Inline Validation**
```python
@app.delete("/api/tasks/{task_id}")
def delete_task(
    task_id: UUID,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    # proceed with deletion
    ...
```

**Tradeoffs**:
- **Option A Pros**: DRY (don't repeat yourself), less code duplication
- **Option A Cons**: Adds dependency layer complexity, harder to customize error messages per endpoint
- **Option B Pros**: Explicit, easier to understand, simpler debugging
- **Option B Cons**: Repeated code across GET/PATCH/PUT/DELETE endpoints

**Decision**: Use **Option B (inline validation)** for initial implementation. Rationale:
- Only 4 endpoints need ownership checks (GET single, PATCH, PUT, DELETE)
- Explicit ownership logic is easier to audit for security
- Avoids premature abstraction (YAGNI principle)
- Can refactor to Option A later if duplication becomes problematic

---

### 3. Error Response Format

**Question**: What structure should error responses follow for consistency?

**Research Findings**:

FastAPI's default exception handling uses:
```json
{
  "detail": "Error message string or structured object"
}
```

This aligns with RFC 7807 (Problem Details for HTTP APIs) in a simplified form.

**For validation errors** (400, 422), FastAPI returns:
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "ensure this value has at most 500 characters",
      "type": "value_error.any_str.max_length"
    }
  ]
}
```

**For application errors** (404, 403), we use HTTPException:
```python
raise HTTPException(status_code=404, detail="Task not found")
```

Returns:
```json
{
  "detail": "Task not found"
}
```

**Decision**: Use FastAPI's built-in HTTPException for all application errors. Error messages:
- **400 Bad Request**: "Task title is required", "Task title must be 500 characters or less", "Invalid task ID format"
- **401 Unauthorized**: "Could not validate credentials" (from existing auth middleware)
- **403 Forbidden**: "Access forbidden" (generic for security)
- **404 Not Found**: "Task not found"
- **500 Internal Server Error**: "Internal server error" (generic, log details server-side)

---

### 4. Concurrent Request Handling

**Question**: How does SQLModel + Neon handle concurrent updates to the same task?

**Research Findings**:

**PostgreSQL Transaction Isolation**:
- Default isolation level: READ COMMITTED
- Each request gets its own database session
- Concurrent updates to same row: last write wins
- No automatic optimistic locking in SQLModel

**Scenario: Two users toggle the same task's completion**:
1. Request A reads task (completed=false)
2. Request B reads task (completed=false)
3. Request A updates to completed=true, commits
4. Request B updates to completed=false, commits
5. Final state: completed=false (Request B wins)

**For this application**:
- Single user owns each task (no concurrent access by design)
- User can have multiple browser tabs, but rare race condition
- Last write wins is acceptable behavior for todo app

**Optimistic Locking (if needed)**:
Could add `version` field to Task model:
```python
class Task(SQLModel, table=True):
    version: int = Field(default=1)
    ...
```

Check version before update, increment on success, return 409 Conflict if version changed.

**Decision**: No optimistic locking for MVP. Rationale:
- Tasks are single-user resources (ownership enforced)
- Concurrent updates by same user are rare
- Last write wins is acceptable for simple field updates
- Can add versioning later if users report issues
- Keeps implementation simple (YAGNI)

---

### 5. UUID Validation

**Question**: How should we validate task_id parameters are valid UUIDs before querying?

**Research Findings**:

FastAPI + Pydantic provide automatic UUID validation:

**Path Parameter with UUID Type**:
```python
from uuid import UUID

@app.get("/api/tasks/{task_id}")
def get_task(task_id: UUID):  # Pydantic validates this
    ...
```

If client sends invalid UUID (e.g., `/api/tasks/invalid-id`), FastAPI returns:
```json
{
  "detail": [
    {
      "loc": ["path", "task_id"],
      "msg": "value is not a valid uuid",
      "type": "type_error.uuid"
    }
  ]
}
```

HTTP status: **422 Unprocessable Entity**

**Decision**: Use `task_id: UUID` type in path parameters. FastAPI handles validation automatically. No custom validation needed.

---

## Best Practices Summary

### Database Session Management
✅ Use `Depends(get_session)` for automatic lifecycle management
✅ Session auto-commits on success, rolls back on exception
✅ Compatible with Neon serverless PostgreSQL connection pooling

### Authentication & Authorization
✅ Use existing `Depends(get_current_user)` for JWT verification
✅ Inline ownership checks: query task, verify user_id, raise 403 if mismatch
✅ Return generic error messages for security (no user enumeration)

### Error Handling
✅ Use HTTPException with appropriate status codes
✅ Use FastAPI's default error response format (`{"detail": "..."}`)
✅ Log detailed errors server-side, return generic messages to clients

### Request Validation
✅ Use Pydantic schemas for request bodies (TaskCreate, TaskUpdate, TaskToggle)
✅ Use UUID type for path parameters (automatic validation)
✅ FastAPI returns 422 for validation errors automatically

### Concurrent Updates
✅ Accept last-write-wins behavior for MVP
✅ No optimistic locking required (tasks are single-user resources)
✅ Can add versioning later if needed

### Query Patterns
✅ Always filter by user_id for list queries: `where(Task.user_id == current_user_id)`
✅ Always verify ownership for single-task operations
✅ Use `session.get(Task, task_id)` for efficient primary key lookups
✅ Use `session.exec(select(Task).where(...))` for filtered queries
✅ Always refresh after insert/update to get auto-generated timestamps

---

## Technology Recommendations

### Required Imports
```python
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import Session, select
from uuid import UUID
from datetime import datetime
from src.models.task import Task
from src.middleware.auth import get_current_user
from src.db.session import get_session
from src.schemas.task import TaskCreate, TaskUpdate, TaskToggle, TaskResponse
```

### Router Setup
```python
router = APIRouter(prefix="/api", tags=["tasks"])

# Include in main.py:
from src.api.tasks import router as tasks_router
app.include_router(tasks_router)
```

### Pydantic Schema Design
```python
# src/schemas/task.py
from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from datetime import datetime

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)

    @field_validator('title')
    def title_not_whitespace(cls, v):
        if not v.strip():
            raise ValueError('Task title cannot be empty or whitespace')
        return v.strip()

class TaskUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)

    @field_validator('title')
    def title_not_whitespace(cls, v):
        if not v.strip():
            raise ValueError('Task title cannot be empty or whitespace')
        return v.strip()

class TaskToggle(BaseModel):
    completed: bool

class TaskResponse(BaseModel):
    id: UUID
    title: str
    completed: bool
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # For SQLModel compatibility
```

---

## Compliance with Constitution

### Security-First Architecture ✅
- JWT authentication required on all endpoints
- User ownership enforced for all operations
- No cross-user data access possible
- Generic error messages prevent information disclosure

### Clear Separation of Concerns ✅
- API layer: `api/tasks.py` (endpoint logic)
- Schema layer: `schemas/task.py` (validation)
- Model layer: `models/task.py` (database)
- Middleware layer: `middleware/auth.py` (authentication)

### Simplicity ✅
- No premature abstractions (inline ownership checks)
- No optimistic locking (YAGNI)
- Standard FastAPI patterns throughout
- Minimal dependencies (only what's already installed)

---

## Open Questions (None Remaining)

All technical questions have been resolved. The research provides sufficient guidance for implementation via the `fastapi-backend` agent.

---

**Research Status**: ✅ **COMPLETE** - All unknowns resolved, ready for Phase 1 design artifacts.
