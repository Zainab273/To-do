# Tasks: Backend API & Data Layer

**Input**: Design documents from `/specs/002-backend-api-data/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), contracts/openapi.yaml (complete)

**Tests**: Tests are NOT requested in this feature specification - only manual testing via FastAPI Swagger UI and frontend integration.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `backend/src/` for API, `frontend/src/` for UI
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare schemas layer for request/response validation

- [X] T001 Create Pydantic schemas directory at backend/src/schemas/
- [X] T002 Create backend/src/schemas/__init__.py to make schemas a Python package

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Update backend/src/db/session.py to add get_session() generator function for dependency injection
- [X] T004 [P] Create TaskCreate Pydantic schema in backend/src/schemas/task.py with title validation
- [X] T005 [P] Create TaskUpdate Pydantic schema in backend/src/schemas/task.py with title validation
- [X] T006 [P] Create TaskToggle Pydantic schema in backend/src/schemas/task.py with completed boolean
- [X] T007 [P] Create TaskResponse Pydantic schema in backend/src/schemas/task.py for API responses
- [X] T008 Create FastAPI router for tasks in backend/src/api/tasks.py with /api prefix and "tasks" tag

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create New Tasks via API (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can create new todo tasks through POST /api/tasks endpoint with validation, user ownership enforcement, and database persistence

**Independent Test**: Send POST request with JWT token and task title, verify task created in database with correct user_id, completed=false, and timestamps. Returns 201 with complete task object.

### Implementation for User Story 1

- [X] T009 [US1] Implement POST /api/tasks endpoint in backend/src/api/tasks.py with get_current_user and get_session dependencies
- [X] T010 [US1] Add title validation logic in POST endpoint (trim whitespace, check non-empty, max 500 chars)
- [X] T011 [US1] Add task creation logic in POST endpoint (set user_id from JWT, completed=false, timestamps)
- [X] T012 [US1] Add database commit and refresh logic in POST endpoint to return created task
- [X] T013 [US1] Add error handling for validation failures (400 Bad Request) in POST endpoint
- [X] T014 [US1] Add error handling for authentication failures (401 Unauthorized) in POST endpoint
- [X] T015 [US1] Verify POST endpoint returns 201 Created with TaskResponse schema

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create tasks via API

---

## Phase 4: User Story 2 - Retrieve User's Task List via API (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can retrieve their complete list of tasks through GET /api/tasks endpoint with user isolation and newest-first ordering

**Independent Test**: Create multiple tasks for different users, send GET request with JWT token, verify only authenticated user's tasks returned in correct order (newest first). Empty array for no tasks.

### Implementation for User Story 2

- [X] T016 [US2] Implement GET /api/tasks endpoint in backend/src/api/tasks.py with get_current_user and get_session dependencies
- [X] T017 [US2] Add user-scoped query logic in GET endpoint (filter by user_id from JWT)
- [X] T018 [US2] Add ordering logic in GET endpoint (order by created_at descending)
- [X] T019 [US2] Add response serialization logic in GET endpoint (return array of TaskResponse)
- [X] T020 [US2] Add error handling for authentication failures (401 Unauthorized) in GET endpoint
- [X] T021 [US2] Verify GET endpoint returns 200 OK with array of TaskResponse schemas

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can create and list tasks

---

## Phase 5: User Story 3 - Toggle Task Completion Status via API (Priority: P2)

**Goal**: Authenticated users can update task completion status through PATCH /api/tasks/{task_id} endpoint with ownership validation

**Independent Test**: Create task, send PATCH request with completed=true, verify database updated and updated_at timestamp refreshed. Verify 403 for other user's task.

### Implementation for User Story 3

- [X] T022 [US3] Implement PATCH /api/tasks/{task_id} endpoint in backend/src/api/tasks.py with task_id as UUID path parameter
- [X] T023 [US3] Add task retrieval logic in PATCH endpoint (query by task_id primary key)
- [X] T024 [US3] Add ownership validation logic in PATCH endpoint (verify task.user_id == current_user_id)
- [X] T025 [US3] Add completion status update logic in PATCH endpoint (set task.completed from request body)
- [X] T026 [US3] Add updated_at timestamp refresh logic in PATCH endpoint
- [X] T027 [US3] Add database commit and refresh logic in PATCH endpoint
- [X] T028 [US3] Add error handling for invalid UUID format (422 Unprocessable Entity) in PATCH endpoint
- [X] T029 [US3] Add error handling for task not found (404 Not Found) in PATCH endpoint
- [X] T030 [US3] Add error handling for ownership violation (403 Forbidden) in PATCH endpoint
- [X] T031 [US3] Add error handling for authentication failures (401 Unauthorized) in PATCH endpoint
- [X] T032 [US3] Verify PATCH endpoint returns 200 OK with updated TaskResponse schema

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - users can create, list, and toggle tasks

---

## Phase 6: User Story 4 - Update Task Title via API (Priority: P3)

**Goal**: Authenticated users can edit task titles through PUT /api/tasks/{task_id} endpoint with validation and ownership checks

**Independent Test**: Create task, send PUT request with new title, verify database updated with new title and refreshed updated_at. Verify validation errors for empty/long titles.

### Implementation for User Story 4

- [X] T033 [US4] Implement PUT /api/tasks/{task_id} endpoint in backend/src/api/tasks.py with task_id as UUID path parameter
- [X] T034 [US4] Add task retrieval logic in PUT endpoint (query by task_id primary key)
- [X] T035 [US4] Add ownership validation logic in PUT endpoint (verify task.user_id == current_user_id)
- [X] T036 [US4] Add title validation logic in PUT endpoint (trim whitespace, check non-empty, max 500 chars)
- [X] T037 [US4] Add title update logic in PUT endpoint (set task.title from request body)
- [X] T038 [US4] Add updated_at timestamp refresh logic in PUT endpoint
- [X] T039 [US4] Add database commit and refresh logic in PUT endpoint
- [X] T040 [US4] Add error handling for validation failures (400 Bad Request) in PUT endpoint
- [X] T041 [US4] Add error handling for invalid UUID format (422 Unprocessable Entity) in PUT endpoint
- [X] T042 [US4] Add error handling for task not found (404 Not Found) in PUT endpoint
- [X] T043 [US4] Add ownership validation (403 Forbidden) in PUT endpoint
- [X] T044 [US4] Add error handling for authentication failures (401 Unauthorized) in PUT endpoint
- [X] T045 [US4] Verify PUT endpoint returns 200 OK with updated TaskResponse schema

**Checkpoint**: At this point, User Stories 1-4 should all work independently - users can create, list, toggle, and update tasks

---

## Phase 7: User Story 5 - Delete Tasks via API (Priority: P3)

**Goal**: Authenticated users can permanently delete tasks through DELETE /api/tasks/{task_id} endpoint with ownership validation

**Independent Test**: Create task, send DELETE request, verify task removed from database and subsequent GET requests. Verify 204 No Content response.

### Implementation for User Story 5

- [X] T046 [US5] Implement DELETE /api/tasks/{task_id} endpoint in backend/src/api/tasks.py with task_id as UUID path parameter
- [X] T047 [US5] Add task retrieval logic in DELETE endpoint (query by task_id primary key)
- [X] T048 [US5] Add ownership validation logic in DELETE endpoint (verify task.user_id == current_user_id)
- [X] T049 [US5] Add task deletion logic in DELETE endpoint (session.delete)
- [X] T050 [US5] Add database commit logic in DELETE endpoint
- [X] T051 [US5] Add error handling for invalid UUID format (422 Unprocessable Entity) in DELETE endpoint
- [X] T052 [US5] Add error handling for task not found (404 Not Found) in DELETE endpoint
- [X] T053 [US5] Add error handling for ownership violation (403 Forbidden) in DELETE endpoint
- [X] T054 [US5] Add error handling for authentication failures (401 Unauthorized) in DELETE endpoint
- [X] T055 [US5] Verify DELETE endpoint returns 204 No Content with no response body

**Checkpoint**: All user stories should now be independently functional - complete CRUD operations

---

## Phase 8: Integration & Registration

**Purpose**: Wire up the task router to the main FastAPI application

- [X] T056 Register tasks router in backend/src/main.py using app.include_router(tasks_router)
- [X] T057 Verify all endpoints appear in FastAPI Swagger UI at http://localhost:8000/docs
- [X] T058 Verify JWT authentication is enforced on all task endpoints (401 without token)

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validation and documentation

- [ ] T059 [P] Test all endpoints manually using FastAPI Swagger UI per quickstart.md guide
- [ ] T060 [P] Test user isolation by creating tasks with different users and verifying no cross-user access
- [ ] T061 [P] Test all error scenarios per spec (400, 401, 403, 404, 422 responses)
- [ ] T062 [P] Verify all success criteria from spec.md are met (response times, user isolation, HTTP status codes)
- [ ] T063 Update backend README or quickstart.md with API endpoint documentation if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2 → P3 → P3)
- **Integration (Phase 8)**: Depends on at least one user story being complete (typically US1 for MVP)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable)
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable)
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable)

### Within Each User Story

- Tasks within a story are sequential (build on each other)
- Each story ends with a checkpoint for independent validation
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: Both tasks sequential (T002 depends on T001)

**Phase 2 (Foundational)**:
- T003 must complete first (session dependency)
- T004, T005, T006, T007 can all run in parallel (different schemas in same file)
- T008 sequential after schemas (needs imports)

**Phase 3-7 (User Stories)**: Once Foundational completes, ALL user stories can start in parallel if team capacity allows

**Phase 9 (Polish)**: T059, T060, T061, T062 can all run in parallel (different testing activities)

---

## Parallel Example: Foundational Phase

```bash
# After T003 completes, launch all schema creation tasks together:
Task: "Create TaskCreate Pydantic schema in backend/src/schemas/task.py with title validation"
Task: "Create TaskUpdate Pydantic schema in backend/src/schemas/task.py with title validation"
Task: "Create TaskToggle Pydantic schema in backend/src/schemas/task.py with completed boolean"
Task: "Create TaskResponse Pydantic schema in backend/src/schemas/task.py for API responses"
```

---

## Parallel Example: User Stories (after Foundational complete)

```bash
# Once Foundational (Phase 2) is complete, multiple developers can work in parallel:
Developer A: User Story 1 (T009-T015) - POST /api/tasks
Developer B: User Story 2 (T016-T021) - GET /api/tasks
Developer C: User Story 3 (T022-T032) - PATCH /api/tasks/{task_id}

# All three stories work on backend/src/api/tasks.py but different endpoints
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T008) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T009-T015) - Create tasks
4. Complete Phase 4: User Story 2 (T016-T021) - List tasks
5. Complete Phase 8: Integration (T056-T058) - Wire up router
6. **STOP and VALIDATE**: Test US1 and US2 independently via Swagger UI
7. Deploy/demo if ready

**Rationale**: User Stories 1 and 2 together form the minimal viable task management system - users can create tasks and see them in their list. This is the core value proposition.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 + User Story 2 + Integration → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 (Toggle) → Test independently → Deploy/Demo
4. Add User Story 4 (Update) → Test independently → Deploy/Demo
5. Add User Story 5 (Delete) → Test independently → Deploy/Demo
6. Complete Polish phase → Final validation
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T008)
2. Once Foundational is done:
   - Developer A: User Story 1 (T009-T015)
   - Developer B: User Story 2 (T016-T021)
   - Developer C: User Story 3 (T022-T032)
   - Developer D: User Story 4 (T033-T045)
   - Developer E: User Story 5 (T046-T055)
3. Developer A registers router after US1 complete (T056-T058)
4. Stories complete and integrate independently
5. Team validates together (T059-T063)

---

## Task Summary

**Total Tasks**: 63
**User Story Breakdown**:
- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 6 tasks
- Phase 3 (US1 - Create Tasks): 7 tasks
- Phase 4 (US2 - List Tasks): 6 tasks
- Phase 5 (US3 - Toggle Completion): 11 tasks
- Phase 6 (US4 - Update Title): 13 tasks
- Phase 7 (US5 - Delete Tasks): 10 tasks
- Phase 8 (Integration): 3 tasks
- Phase 9 (Polish): 5 tasks

**Parallel Opportunities**:
- Foundational: 4 schema tasks can run in parallel (T004-T007)
- User Stories: All 5 user stories can run in parallel after Foundational complete
- Polish: 4 validation tasks can run in parallel (T059-T062)

**MVP Scope**: Setup + Foundational + US1 + US2 + Integration = 24 tasks
**Full Feature**: All 63 tasks

---

## Notes

- No [P] markers within user story phases (sequential implementation within each story)
- [P] markers in Foundational phase for schema creation (different schemas, same file)
- [P] markers in Polish phase for independent testing activities
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Verify all acceptance scenarios from spec.md during validation
- Use FastAPI Swagger UI for manual testing (no automated tests requested)
- All endpoints use existing JWT middleware (get_current_user dependency)
- All endpoints use database session dependency (get_session)
- No frontend tasks in this feature (frontend integration is separate)
