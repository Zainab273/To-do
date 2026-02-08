---
id: 0002
title: Backend API Data Layer Plan
stage: plan
date: 2026-02-05
surface: agent
model: claude-sonnet-4-5
feature: 002-backend-api-data
branch: 002-backend-api-data
user: zainab
command: /sp.plan
labels: ["planning", "architecture", "fastapi", "rest-api", "database-design"]
links:
  spec: specs/002-backend-api-data/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-backend-api-data/plan.md
  - specs/002-backend-api-data/research.md
  - specs/002-backend-api-data/data-model.md
  - specs/002-backend-api-data/contracts/openapi.yaml
  - specs/002-backend-api-data/quickstart.md
  - CLAUDE.md (updated with tech context)
tests:
  - Constitution Check passed (all principles satisfied)
  - Post-design constitution re-check passed
---

## Prompt

/sp.plan Backend API & Data Layer

Objective:
Design and implement a secure, user-scoped task management backend
using FastAPI, SQLModel, and Neon PostgreSQL.

Step 1: Data Model Definition
- Define Task SQLModel schema:
  - id (primary key)
  - title
  - description (optional)
  - completed (boolean)
  - owner_user_id
  - created_at / updated_at
- Ensure proper indexing for user-scoped queries

Step 2: Database Configuration
- Configure Neon PostgreSQL connection
- Set database URL via environment variable
- Initialize SQLModel engine and session handling
- Ensure compatibility with serverless connections

Step 3: Dependency Injection & Session Management
- Implement FastAPI dependencies for DB sessions
- Ensure safe session lifecycle per request
- Integrate authenticated user context from middleware

Step 4: Endpoint Implementation — List & Create
- GET /api/{user_id}/tasks
  - Return all tasks belonging to authenticated user
- POST /api/{user_id}/tasks
  - Create new task associated with user
- Validate request payloads and responses

Step 5: Endpoint Implementation — Read & Update
- GET /api/{user_id}/tasks/{id}
  - Fetch single task owned by user
- PUT /api/{user_id}/tasks/{id}
  - Update task fields
- Ensure task existence and ownership checks

Step 6: Endpoint Implementation — Delete & Toggle
- DELETE /api/{user_id}/tasks/{id}
  - Permanently remove task
- PATCH /api/{user_id}/tasks/{id}/complete
  - Toggle completion state
- Return appropriate success responses

Step 7: Error Handling & Validation
- Handle common failure cases:
  - Task not found (404)
  - Unauthorized access (403)
  - Invalid payloads (422)
- Ensure consistent error response format

Step 8: Security Enforcement
- Enforce user ownership on every database query
- Never trust user_id without JWT-authenticated context
- Prevent cross-user data access by design

Step 9: Verification & Review
- Validate all endpoints against spec
- Confirm data persistence across requests
- Ensure compatibility with frontend integration
- Verify compliance with sp.constitution before proceeding

## Response snapshot

Generated complete implementation plan with Phase 0 research and Phase 1 design artifacts:

**Plan.md**: Comprehensive architectural plan with:
- Technical context (Python 3.11+, FastAPI, SQLModel, Neon PostgreSQL)
- Constitution Check (all principles ✅)
- Project structure (backend/frontend separation)
- 5 research questions with decisions
- Implementation approach with architectural decisions
- Endpoint implementation strategy (priority-ordered by user story)
- Database query patterns
- Error handling strategy (HTTP status code mapping)
- Security enforcement (JWT + ownership validation)
- Post-design re-check (all principles ✅)
- ADR suggestions (3 significant decisions identified)

**Research.md**: Resolved 5 technical questions:
1. Database session management → Use `Depends(get_session)` pattern
2. Ownership validation → Inline checks (Option B for simplicity)
3. Error response format → FastAPI HTTPException with `{"detail": "..."}`
4. Concurrent requests → Accept last-write-wins (no optimistic locking for MVP)
5. UUID validation → Use Pydantic UUID type in path parameters

**Data-model.md**: Documented entities and relationships:
- Task entity (existing model, all fields documented)
- User entity (referenced, one-to-many relationship)
- Database schema (SQL DDL)
- Validation rules (title 1-500 chars, no whitespace-only)
- Query patterns (create, list, get, update, delete)
- Performance considerations (indexing strategy)

**Contracts/openapi.yaml**: Complete OpenAPI 3.0 specification:
- 5 endpoints: POST /tasks, GET /tasks, GET /tasks/{id}, PATCH /tasks/{id}, PUT /tasks/{id}, DELETE /tasks/{id}
- Request/response schemas (Task, TaskCreate, TaskUpdate, TaskToggle)
- HTTP status codes for all scenarios (200, 201, 204, 400, 401, 403, 404, 422, 500)
- Security scheme (Bearer JWT)
- Error response examples

**Quickstart.md**: Developer testing guide:
- Getting JWT token (via frontend or direct auth)
- FastAPI Swagger UI testing steps
- curl command examples for all endpoints
- Error scenario examples
- Frontend integration code snippets (TypeScript)
- Debugging tips (database queries, JWT decoding, server logs)
- Performance testing guidance

**Agent Context Update**: Added Python 3.11+, FastAPI, SQLModel, python-jose, uvicorn to CLAUDE.md

## Outcome

- ✅ Impact: Complete architectural plan ready for task generation
- 🧪 Tests: Constitution Check passed pre-design and post-design (no violations)
- 📁 Files: plan.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md, CLAUDE.md (updated)
- 🔁 Next prompts: `/sp.tasks` to generate dependency-ordered task list, then `/sp.implement` to execute via fastapi-backend agent
- 🧠 Reflection: Design leverages existing infrastructure (JWT middleware, User/Task models) and follows constitutional principles. All unknowns resolved through research. Ready for implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - all phases completed successfully
- Graders run and results (PASS/FAIL): PASS - Constitution Check (all principles satisfied), PASS - Post-design re-check (no violations)
- Prompt variant (if applicable): Standard /sp.plan workflow with detailed implementation steps provided by user
- Next experiment (smallest change to try): Proceed to /sp.tasks to validate plan completeness through task decomposition
