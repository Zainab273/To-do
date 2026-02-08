# Implementation Plan: Backend API & Data Layer

**Branch**: `002-backend-api-data` | **Date**: 2026-02-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-backend-api-data/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a secure, user-scoped REST API for task management (CRUD operations) using FastAPI, SQLModel ORM, and Neon PostgreSQL. The API will enforce JWT-based authentication on all endpoints, validate user ownership for all operations, and provide consistent error handling with appropriate HTTP status codes. The implementation builds on existing authentication infrastructure (JWT middleware, User/Task models) to deliver five prioritized user stories: Create Tasks (P1), List Tasks (P1), Toggle Completion (P2), Update Title (P3), and Delete Tasks (P3).

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI (latest), SQLModel (latest), python-jose[cryptography] (JWT), uvicorn (ASGI server)
**Storage**: Neon Serverless PostgreSQL (already configured via DATABASE_URL)
**Testing**: Manual testing via FastAPI /docs (Swagger UI), curl, and frontend integration
**Target Platform**: Linux server (development), cloud deployment (production)
**Project Type**: Web backend API (part of full-stack application)
**Performance Goals**: <1 second response time for list queries (up to 100 tasks), <2 seconds for create/update/delete operations
**Constraints**: Stateless authentication (JWT only), strict user isolation (no cross-user data access), serverless-compatible (no local state)
**Scale/Scope**: Initial support for 100+ concurrent users, 10,000+ tasks per user, 5 REST endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principle Compliance

**I. Spec-Driven Development** ✅
- Specification complete and approved (spec.md)
- Implementation plan being generated from spec
- Tasks will be generated from this plan
- Implementation will use specialized Claude Code agents only

**II. End-to-End Correctness Across All Layers** ✅
- API contracts will match frontend expectations
- Database models (Task, User) already exist and match spec
- HTTP status codes defined in spec (200, 201, 204, 400, 401, 403, 404, 500)
- User isolation enforced at API layer (JWT verification) and DB layer (user_id filtering)

**III. Security-First Architecture** ✅
- JWT-based stateless authentication (existing middleware: `src/middleware/auth.py`)
- All endpoints will use `get_current_user` dependency for auth
- User ownership validation on all operations (403 Forbidden for unauthorized access)
- No cross-user data access (queries filtered by authenticated user_id)
- Secrets in environment variables (BETTER_AUTH_SECRET, DATABASE_URL)

**IV. Clear Separation of Concerns** ✅
- Authentication Layer: Better Auth (already implemented) issues JWT tokens
- Backend Layer: FastAPI endpoints (this feature) handle business logic and validation
- Data Layer: SQLModel (existing models) manages database operations
- Frontend Layer: Next.js (separate feature) consumes REST API

**V. Reproducibility via Explicit Artifacts** ✅
- Specification: spec.md (complete)
- Implementation Plan: plan.md (this file)
- Task List: tasks.md (will be generated via /sp.tasks)
- PHRs: Created for all agent interactions
- ADRs: Will be suggested for significant decisions

**VI. Agent-Generated Code Only** ✅
- Backend API implementation: `fastapi-backend` agent
- Database queries: `neon-db-manager` agent (if schema changes needed)
- No manual coding permitted

### Technology Stack Compliance

✅ **Backend**: Python FastAPI (required)
✅ **ORM**: SQLModel (required)
✅ **Database**: Neon Serverless PostgreSQL (required)
✅ **Authentication**: JWT verification via Better Auth middleware (required)
✅ **Spec Workflow**: Claude Code + Spec-Kit Plus (required)

### Security Requirements Compliance

✅ **Authentication Flow**: JWT tokens in Authorization header
✅ **Token Verification**: Existing middleware (`src/middleware/auth.py`)
✅ **Authorization**: User ownership checks in endpoint logic
✅ **No Cross-User Access**: Database queries scoped to authenticated user
✅ **Secrets Management**: Environment variables only
✅ **Input Sanitization**: Pydantic models and SQLModel ORM prevent injection

### Forbidden Practices - All Avoided

✅ No plaintext passwords (Better Auth handles hashing)
✅ No trusting client-provided user IDs (JWT is source of truth)
✅ No bypassing authentication (all endpoints protected)
✅ No logging sensitive data
✅ No exposing internal errors (generic 500 messages)

**GATE RESULT**: ✅ **PASSED** - All constitutional principles satisfied. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-backend-api-data/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification (completed)
├── research.md          # Phase 0 output (technical research)
├── data-model.md        # Phase 1 output (entity design)
├── quickstart.md        # Phase 1 output (developer guide)
├── contracts/           # Phase 1 output (API specifications)
│   └── openapi.yaml     # OpenAPI 3.0 specification for REST endpoints
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Spec quality checklist (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/                    # REST endpoint routers
│   │   ├── __init__.py         # (existing - empty)
│   │   └── tasks.py            # NEW: Task CRUD endpoints (POST, GET, PATCH, PUT, DELETE)
│   ├── models/                 # Database models
│   │   ├── __init__.py         # (existing)
│   │   ├── user.py             # (existing - User SQLModel)
│   │   └── task.py             # (existing - Task SQLModel)
│   ├── middleware/             # Request middleware
│   │   ├── __init__.py         # (existing)
│   │   └── auth.py             # (existing - JWT verification, get_current_user)
│   ├── core/                   # Core utilities
│   │   ├── __init__.py         # (existing)
│   │   ├── config.py           # (existing - settings)
│   │   └── security.py         # (existing - JWT decode/verify)
│   ├── db/                     # Database configuration
│   │   ├── __init__.py         # (existing)
│   │   └── session.py          # (existing - engine, get_session)
│   ├── schemas/                # NEW: Pydantic request/response models
│   │   ├── __init__.py         # NEW
│   │   └── task.py             # NEW: TaskCreate, TaskUpdate, TaskToggle, TaskResponse
│   └── main.py                 # (existing - FastAPI app, will add tasks router)
├── tests/                      # Test suite (if testing is added later)
│   ├── contract/               # API contract tests
│   ├── integration/            # End-to-end tests
│   └── unit/                   # Unit tests
├── requirements.txt            # (existing - Python dependencies)
├── .env.example                # (existing - environment template)
└── schema.sql                  # (existing - database migration)

frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   └── (protected)/
│   │       └── tasks/
│   │           └── page.tsx    # UPDATED: Will consume new task API endpoints
│   ├── components/             # React components
│   │   └── TaskList.tsx        # NEW: Component for displaying and managing tasks
│   └── lib/
│       ├── api-client.ts       # (existing - authenticated fetch wrapper)
│       └── types.ts            # UPDATED: Add Task type definitions
└── ...
```

**Structure Decision**: Web application structure (Option 2) with existing `backend/` and `frontend/` directories. The backend follows a layered architecture: `api/` for endpoints, `models/` for database entities, `middleware/` for cross-cutting concerns (auth), `schemas/` for request/response validation, and `core/`+`db/` for shared utilities. This structure already exists from the authentication feature (001) and this feature extends it with new task endpoints and schemas.

## Complexity Tracking

**No constitutional violations** - this section is empty as all principles are satisfied.

The feature introduces no additional complexity beyond what's required by the specification. All endpoints follow standard REST conventions, leverage existing infrastructure (JWT middleware, SQLModel ORM, database models), and maintain the established architectural patterns from the authentication feature.

## Phase 0: Research & Technical Decisions

### Research Questions

1. **FastAPI Dependency Injection for Database Sessions**
   - Question: How should we manage database sessions in FastAPI endpoints to ensure proper cleanup and prevent connection leaks?
   - Research needed: Best practices for SQLModel session management in FastAPI

2. **User Ownership Validation Pattern**
   - Question: Should ownership checks be centralized in a reusable dependency or implemented per-endpoint?
   - Research needed: FastAPI dependency patterns for resource authorization

3. **Error Response Format**
   - Question: What structure should error responses follow for consistency?
   - Research needed: FastAPI exception handling best practices and HTTP problem details (RFC 7807)

4. **Concurrent Request Handling**
   - Question: How does SQLModel + Neon handle concurrent updates to the same task?
   - Research needed: Transaction isolation levels, optimistic locking strategies

5. **UUID Validation**
   - Question: How should we validate task_id parameters are valid UUIDs before querying?
   - Research needed: FastAPI path parameter validation with Pydantic

### Expected Research Outputs

The `research.md` file will document:
- Recommended session management pattern (likely `Depends(get_session)`)
- Ownership validation approach (custom dependency vs inline checks)
- Standard error response schema (HTTP status + error detail)
- Transaction handling for concurrent requests
- UUID validation using FastAPI path parameter types

## Phase 1: Design Artifacts

### Data Model (`data-model.md`)

Will document:

**Task Entity** (already exists in `backend/src/models/task.py`):
- Fields: id (UUID), user_id (UUID FK), title (str ≤500), completed (bool), created_at (datetime), updated_at (datetime)
- Indexes: user_id (for efficient user-scoped queries)
- Constraints: NOT NULL on all fields except description (if added later)
- Relationships: Many-to-one with User (via user_id foreign key)

**User Entity** (already exists in `backend/src/models/user.py`):
- Referenced by Task.user_id
- Used for JWT token user_id validation

### API Contracts (`contracts/openapi.yaml`)

Will define OpenAPI 3.0 specification for:

**POST /api/tasks**
- Request: `{"title": "string (1-500 chars)"}`
- Response 201: Task object with id, title, completed, user_id, created_at, updated_at
- Response 400: Validation error (empty title, too long)
- Response 401: Unauthorized (missing/invalid JWT)

**GET /api/tasks**
- Response 200: Array of Task objects (user-scoped, ordered by created_at DESC)
- Response 401: Unauthorized

**GET /api/tasks/{task_id}** (optional - not in spec but useful)
- Response 200: Single Task object
- Response 401: Unauthorized
- Response 403: Forbidden (task owned by different user)
- Response 404: Not found

**PATCH /api/tasks/{task_id}**
- Request: `{"completed": boolean}`
- Response 200: Updated Task object
- Response 400: Invalid task_id format
- Response 401: Unauthorized
- Response 403: Forbidden
- Response 404: Not found

**PUT /api/tasks/{task_id}**
- Request: `{"title": "string (1-500 chars)"}`
- Response 200: Updated Task object
- Response 400: Validation error or invalid task_id
- Response 401: Unauthorized
- Response 403: Forbidden
- Response 404: Not found

**DELETE /api/tasks/{task_id}**
- Response 204: No content (success)
- Response 400: Invalid task_id format
- Response 401: Unauthorized
- Response 403: Forbidden
- Response 404: Not found

### Quickstart Guide (`quickstart.md`)

Will provide:
- How to test endpoints using FastAPI /docs
- Example curl commands with JWT tokens
- Common error scenarios and debugging
- Integration with frontend API client

## Implementation Approach

### Key Architectural Decisions

**Decision 1: RESTful Endpoint Design**
- **Rationale**: Follow REST conventions for predictable, standard API behavior
- **Alternatives**: GraphQL (too complex for simple CRUD), RPC-style (less standard)
- **Chosen**: REST with standard HTTP verbs (GET, POST, PUT, PATCH, DELETE)

**Decision 2: Pydantic Schemas for Validation**
- **Rationale**: Separate request/response models from database models for flexibility
- **Alternatives**: Use SQLModel directly for requests (couples API to DB schema)
- **Chosen**: Create `schemas/task.py` with TaskCreate, TaskUpdate, TaskToggle, TaskResponse

**Decision 3: Dependency Injection for Auth and DB**
- **Rationale**: Leverage FastAPI's built-in dependency system for clean, testable code
- **Alternatives**: Manual session/auth management (error-prone, verbose)
- **Chosen**: Use `Depends(get_current_user)` and `Depends(get_session)` in all endpoints

**Decision 4: User Ownership Validation in Endpoint Logic**
- **Rationale**: Simple, explicit checks are easier to understand than complex dependency graphs
- **Alternatives**: Custom dependency that fetches and validates ownership (premature abstraction)
- **Chosen**: Inline ownership checks: query task, verify task.user_id == current_user_id, raise 403 if mismatch

**Decision 5: Generic 500 Error Messages**
- **Rationale**: Never expose internal errors (database failures, stack traces) to clients
- **Alternatives**: Detailed error messages (security risk)
- **Chosen**: Return generic "Internal server error" message, log details server-side

### Endpoint Implementation Strategy

**Priority Order** (follows spec user story priorities):
1. **P1**: POST /api/tasks (User Story 1: Create Tasks)
2. **P1**: GET /api/tasks (User Story 2: List Tasks)
3. **P2**: PATCH /api/tasks/{task_id} (User Story 3: Toggle Completion)
4. **P3**: PUT /api/tasks/{task_id} (User Story 4: Update Title)
5. **P3**: DELETE /api/tasks/{task_id} (User Story 5: Delete Tasks)

Each endpoint will:
1. Extract authenticated user_id via `get_current_user` dependency
2. Validate request payload (Pydantic schema)
3. Perform database operation (create/read/update/delete)
4. Enforce user ownership on read/update/delete operations
5. Handle errors (validation, not found, forbidden, database)
6. Return appropriate HTTP status code and response

### Database Query Patterns

**Create Task**:
```python
task = Task(title=request.title, user_id=current_user_id, completed=False)
session.add(task)
session.commit()
session.refresh(task)
return task
```

**List Tasks (User-Scoped)**:
```python
tasks = session.exec(
    select(Task)
    .where(Task.user_id == current_user_id)
    .order_by(Task.created_at.desc())
).all()
return tasks
```

**Get Single Task with Ownership Check**:
```python
task = session.get(Task, task_id)
if not task:
    raise HTTPException(status_code=404, detail="Task not found")
if task.user_id != current_user_id:
    raise HTTPException(status_code=403, detail="Access forbidden")
return task
```

**Update Task**:
```python
task = get_task_with_ownership_check(session, task_id, current_user_id)
task.title = request.title  # or task.completed = request.completed
task.updated_at = datetime.utcnow()
session.add(task)
session.commit()
session.refresh(task)
return task
```

**Delete Task**:
```python
task = get_task_with_ownership_check(session, task_id, current_user_id)
session.delete(task)
session.commit()
return Response(status_code=204)
```

### Error Handling Strategy

**HTTP Status Code Mapping**:
- **200 OK**: Successful GET, PUT, PATCH (return updated resource)
- **201 Created**: Successful POST (return created resource)
- **204 No Content**: Successful DELETE (no response body)
- **400 Bad Request**: Validation errors (empty title, too long, invalid UUID format)
- **401 Unauthorized**: Missing, invalid, or expired JWT token
- **403 Forbidden**: Valid token but accessing another user's resource
- **404 Not Found**: Resource doesn't exist (task_id not found)
- **422 Unprocessable Entity**: Pydantic validation errors (FastAPI default)
- **500 Internal Server Error**: Database failures, unexpected exceptions

**Error Response Format**:
```json
{
  "detail": "Error message string"
}
```

FastAPI's HTTPException provides this format automatically.

### Security Enforcement

**JWT Verification** (existing middleware):
- All endpoints use `current_user_id: str = Depends(get_current_user)`
- Middleware extracts and verifies JWT signature
- Middleware decodes token to get user_id
- Returns 401 if token missing/invalid/expired

**User Ownership Validation** (new logic):
- For GET/PATCH/PUT/DELETE on specific task: query by task_id, verify task.user_id == current_user_id
- For GET list: filter query with `WHERE user_id = current_user_id`
- Return 403 Forbidden if ownership check fails

**Input Sanitization**:
- Pydantic schemas validate all inputs (title length, completed boolean)
- SQLModel ORM uses parameterized queries (prevents SQL injection)
- No raw SQL execution

### Frontend Integration Considerations

The existing frontend API client (`frontend/src/lib/api-client.ts`) will:
- Automatically include JWT token in Authorization header
- Handle 401 responses by redirecting to signin
- Parse JSON responses and error messages

Frontend components will:
- Call `apiClient('/api/tasks', {method: 'POST', body: JSON.stringify({title: '...'})})` to create tasks
- Call `apiClient('/api/tasks')` to fetch task list
- Call `apiClient(\`/api/tasks/\${id}\`, {method: 'PATCH', body: JSON.stringify({completed: true})})` to toggle
- Call `apiClient(\`/api/tasks/\${id}\`, {method: 'PUT', body: JSON.stringify({title: '...'})})` to update
- Call `apiClient(\`/api/tasks/\${id}\`, {method: 'DELETE'})` to delete

TypeScript types will be added to `frontend/src/lib/types.ts`:
```typescript
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}
```

## Post-Design Constitution Re-Check

### Re-evaluating Core Principles After Design

**I. Spec-Driven Development** ✅
- Design derived from spec.md
- No implementation started yet
- Tasks will be generated from this plan

**II. End-to-End Correctness** ✅
- API contracts defined and match frontend expectations
- Database models already exist and match API responses
- HTTP status codes documented for all scenarios
- User isolation enforced at API and DB layers

**III. Security-First Architecture** ✅
- All endpoints require JWT authentication
- Ownership validation prevents cross-user access
- No hardcoded secrets
- Generic error messages protect against information disclosure

**IV. Clear Separation of Concerns** ✅
- API layer (`api/tasks.py`): endpoint logic
- Schema layer (`schemas/task.py`): request/response validation
- Model layer (`models/task.py`): database entities
- Middleware layer (`middleware/auth.py`): JWT verification
- No layer violations

**V. Reproducibility** ✅
- All design decisions documented in this plan
- research.md will capture technical research
- contracts/ will provide API specifications
- tasks.md will break work into testable units

**VI. Agent-Generated Code** ✅
- Implementation will use `fastapi-backend` agent
- No manual coding

**GATE RESULT**: ✅ **PASSED** - Design maintains constitutional compliance. Ready to proceed to Phase 2 (task generation).

## Next Steps

1. **Generate research.md** (Phase 0 completion)
   - Research FastAPI + SQLModel best practices
   - Document dependency injection patterns
   - Define error handling conventions

2. **Generate data-model.md** (Phase 1 artifact)
   - Document Task and User entities
   - Define relationships and constraints

3. **Generate contracts/openapi.yaml** (Phase 1 artifact)
   - Create OpenAPI 3.0 specification for 5 endpoints

4. **Generate quickstart.md** (Phase 1 artifact)
   - Testing guide for developers

5. **Update agent context** (Phase 1 completion)
   - Run `.specify/scripts/bash/update-agent-context.sh claude`

6. **Generate tasks.md** (Phase 2 - separate command)
   - Run `/sp.tasks` to create dependency-ordered task list
   - Organize by user story priority (P1 → P2 → P3)

7. **Implementation** (Phase 3 - separate command)
   - Run `/sp.implement` to execute tasks via `fastapi-backend` agent

## ADR Suggestions

The following architectural decisions are significant and should be documented in ADRs (pending user approval):

1. **ADR-001: REST API Design for Task Management**
   - Decision: Use RESTful HTTP API with standard verbs
   - Alternatives: GraphQL, RPC-style endpoints
   - Impact: Long-term API design pattern for the application

2. **ADR-002: Pydantic Schemas Separate from Database Models**
   - Decision: Create dedicated `schemas/` directory for request/response models
   - Alternatives: Reuse SQLModel classes directly in endpoints
   - Impact: Coupling between API contracts and database schema

3. **ADR-003: Inline Ownership Validation vs Custom Dependency**
   - Decision: Perform ownership checks inline within each endpoint
   - Alternatives: Create reusable `get_owned_task` dependency
   - Impact: Code duplication vs abstraction complexity

**Recommendation**: Document ADR-001 and ADR-002 (foundational patterns). ADR-003 is less critical and can be revisited if ownership logic becomes complex.

---

**Plan Status**: ✅ **COMPLETE** - Ready for Phase 0 research generation and Phase 1 design artifacts.
