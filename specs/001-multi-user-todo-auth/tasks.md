---

description: "Task list for Multi-User Todo Application with Authentication"
---

# Tasks: Multi-User Todo Application with Authentication

**Input**: Design documents from `/specs/001-multi-user-todo-auth/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not included in this task list per spec (testing not explicitly requested)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below assume web app structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create root project directories (backend/, frontend/, shared/)
- [ ] T002 [P] Initialize Python backend project with requirements.txt in backend/
- [ ] T003 [P] Initialize Next.js frontend project with package.json in frontend/
- [ ] T004 [P] Create environment variable templates (.env.example, backend/.env.example, frontend/.env.local.example)
- [ ] T005 [P] Create backend source structure (backend/src/models/, backend/src/middleware/, backend/src/api/, backend/src/core/, backend/src/db/)
- [ ] T006 [P] Create frontend source structure (frontend/src/app/, frontend/src/lib/, frontend/src/components/)
- [ ] T007 [P] Configure Python dependencies in backend/requirements.txt (FastAPI, SQLModel, python-jose, passlib, psycopg2-binary, python-dotenv, uvicorn)
- [ ] T008 [P] Configure Node dependencies in frontend/package.json (Next.js 16+, React 18+, Better Auth, TypeScript)
- [ ] T009 [P] Create TypeScript config in frontend/tsconfig.json
- [ ] T010 [P] Create Python __init__.py files in all backend/src/ subdirectories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Create database models - User entity in backend/src/models/user.py (id, email, hashed_password, created_at)
- [ ] T012 Create database models - Task entity in backend/src/models/task.py (id, user_id, title, completed, created_at, updated_at)
- [ ] T013 Configure database connection in backend/src/db/session.py (Neon PostgreSQL connection string, SQLModel engine)
- [ ] T014 Create environment configuration in backend/src/core/config.py (BETTER_AUTH_SECRET, DATABASE_URL, FRONTEND_URL)
- [ ] T015 Implement JWT verification utilities in backend/src/core/security.py (decode token, verify signature, extract user_id)
- [ ] T016 Implement JWT verification middleware in backend/src/middleware/auth.py (verify token, extract user, return 401 on failure)
- [ ] T017 Create FastAPI app entry point in backend/src/main.py (app instance, CORS middleware, router registration)
- [ ] T018 Configure CORS in backend/src/main.py (allow frontend origin, Authorization header, credentials)
- [ ] T019 [P] Configure Better Auth in frontend/src/lib/auth.ts (JWT plugin, HS256, 24h expiration, user_id and email claims)
- [ ] T020 [P] Create API client wrapper in frontend/src/lib/api-client.ts (automatic JWT attachment, Authorization header, 401 handling)
- [ ] T021 [P] Create TypeScript types in frontend/src/lib/types.ts (User interface, Task interface matching backend models)
- [ ] T022 [P] Create Next.js middleware in frontend/src/middleware.ts (protect /tasks routes, redirect to /signin if unauthenticated)
- [ ] T023 Create database schema migration SQL script (CREATE TABLE users, CREATE TABLE tasks, indexes, foreign keys, check constraints)
- [ ] T024 Execute database migration on Neon PostgreSQL (run migration script, verify tables created)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Signup and Signin (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts, sign in, and sign out with JWT-based authentication

**Independent Test**: Create a new account, sign out, sign back in, verify JWT token in browser DevTools Network tab

### Implementation for User Story 1

- [ ] T025 [P] [US1] Create Signup page in frontend/src/app/(auth)/signup/page.tsx (route for signup UI)
- [ ] T026 [P] [US1] Create Signin page in frontend/src/app/(auth)/signin/page.tsx (route for signin UI)
- [ ] T027 [P] [US1] Create SignupForm component in frontend/src/components/SignupForm.tsx (email, password, confirmPassword fields, validation)
- [ ] T028 [P] [US1] Create SigninForm component in frontend/src/components/SigninForm.tsx (email, password fields, error handling)
- [ ] T029 [US1] Integrate Better Auth signup in SignupForm component (call Better Auth signup API, handle errors, redirect on success)
- [ ] T030 [US1] Integrate Better Auth signin in SigninForm component (call Better Auth signin API, store JWT, redirect to /tasks on success)
- [ ] T031 [US1] Implement signout functionality in frontend layout or navigation (clear JWT, redirect to /signin)
- [ ] T032 [US1] Add validation for password requirements in SignupForm (min 8 chars, uppercase, lowercase, number)
- [ ] T033 [US1] Add validation for email format in SignupForm and SigninForm (regex pattern check)
- [ ] T034 [US1] Display validation errors inline in SignupForm (password too weak, email invalid, password mismatch)
- [ ] T035 [US1] Display authentication errors in SigninForm (invalid credentials, generic error message)
- [ ] T036 [US1] Handle duplicate email error in SignupForm (display "Email already registered" message)
- [ ] T037 [US1] Create root layout in frontend/src/app/layout.tsx (HTML structure, metadata, Better Auth provider)
- [ ] T038 [US1] Create landing page in frontend/src/app/page.tsx (redirect to /tasks if authenticated, else /signin)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Create and View Tasks (Priority: P2)

**Goal**: Authenticated users can create new tasks and view their task list

**Independent Test**: Sign in, create multiple tasks, verify they appear in list, verify only user's own tasks visible

### Implementation for User Story 2

- [ ] T039 [US2] Create task CRUD endpoints in backend/src/api/tasks.py (GET /api/users/{user_id}/tasks, POST /api/users/{user_id}/tasks)
- [ ] T040 [US2] Implement GET /api/users/{user_id}/tasks endpoint (verify JWT, match user_id, query tasks WHERE user_id = authenticated_user, return JSON)
- [ ] T041 [US2] Implement POST /api/users/{user_id}/tasks endpoint (verify JWT, match user_id, validate title non-empty, create task, return created task)
- [ ] T042 [US2] Add user_id validation in task endpoints (compare JWT sub claim with path user_id, return 403 if mismatch)
- [ ] T043 [US2] Add title validation in POST endpoint (check title not empty after trim, return 422 with error message if invalid)
- [ ] T044 [US2] Register task router in backend/src/main.py (include tasks router with /api prefix)
- [ ] T045 [P] [US2] Create Tasks page in frontend/src/app/(protected)/tasks/page.tsx (protected route for task list)
- [ ] T046 [P] [US2] Create TaskList component in frontend/src/components/TaskList.tsx (fetch and display tasks, loading state, empty state)
- [ ] T047 [P] [US2] Create TaskItem component in frontend/src/components/TaskItem.tsx (display task title, completion status, placeholder for actions)
- [ ] T048 [P] [US2] Create AddTaskForm component in frontend/src/components/AddTaskForm.tsx (input field, submit button, loading state)
- [ ] T049 [US2] Implement task fetching in TaskList (call GET /api/users/{user_id}/tasks via API client, handle loading/error states)
- [ ] T050 [US2] Implement task creation in AddTaskForm (call POST /api/users/{user_id}/tasks via API client, clear input on success, refresh list)
- [ ] T051 [US2] Display validation error in AddTaskForm (show error message if title empty, inline below input field)
- [ ] T052 [US2] Implement task list ordering in backend (ORDER BY created_at DESC to show newest first)
- [ ] T053 [US2] Add unauthenticated redirect in Tasks page (middleware already protects route, verify redirect to /signin works)
- [ ] T054 [US2] Style Tasks page for responsive layout (desktop grid, mobile stack, works on 1920x1080 and 375x667)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Tasks as Complete/Incomplete (Priority: P3)

**Goal**: Users can toggle task completion status with visual indicators

**Independent Test**: Create tasks, mark them complete, verify the visual change, unmark them, and verify the state changes.

### Implementation for User Story 3

- [ ] T055 [US3] Create toggle completion endpoint in backend/src/api/tasks.py (PATCH /api/users/{user_id}/tasks/{task_id}/toggle)
- [ ] T056 [US3] Implement PATCH /api/users/{user_id}/tasks/{task_id}/toggle endpoint (verify JWT, match user_id, verify task ownership, toggle completed field, update updated_at, return task)
- [ ] T057 [US3] Add task ownership verification in toggle endpoint (query WHERE id = task_id AND user_id = authenticated_user, return 404 if not found)
- [ ] T058 [US3] Add checkbox UI to TaskItem component in frontend/src/components/TaskItem.tsx (clickable checkbox, reflect completed state)
- [ ] T059 [US3] Implement toggle handler in TaskItem (call PATCH /api/users/{user_id}/tasks/{task_id}/toggle via API client, update local state)
- [ ] T060 [US3] Add visual indicator for completed tasks in TaskItem (strikethrough text-decoration, checkmark icon or different color)
- [ ] T061 [US3] Add visual indicator for incomplete tasks in TaskItem (normal text, empty checkbox)
- [ ] T062 [US3] Ensure completion state persists after page refresh (backend persists to database, frontend refetches on mount)
- [ ] T063 [US3] Handle toggle errors gracefully in TaskItem (display error message if request fails, revert checkbox state)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Update Task Title (Priority: P4)

**Goal**: Users can edit task titles to correct mistakes

**Independent Test**: Create a task, edit its title, save the change, and verify the updated title persists.

### Implementation for User Story 4

- [ ] T064 [US4] Create update task endpoint in backend/src/api/tasks.py (PATCH /api/users/{user_id}/tasks/{task_id})
- [ ] T065 [US4] Implement PATCH /api/users/{user_id}/tasks/{task_id} endpoint (verify JWT, match user_id, verify task ownership, validate title non-empty, update title, update updated_at, return task)
- [ ] T066 [US4] Add task ownership verification in update endpoint (query WHERE id = task_id AND user_id = authenticated_user, return 404 if not found)
- [ ] T067 [US4] Add title validation in update endpoint (check title not empty after trim, return 422 with error message if invalid)
- [ ] T068 [US4] Add edit mode state to TaskItem component (track isEditing boolean, show input field vs display text)
- [ ] T069 [US4] Add edit button to TaskItem component (icon button, onClick sets isEditing = true)
- [ ] T070 [US4] Add edit input field to TaskItem component (pre-filled with current title, shown when isEditing = true)
- [ ] T071 [US4] Add save button to TaskItem edit mode (onClick calls update endpoint, sets isEditing = false on success)
- [ ] T072 [US4] Add cancel button to TaskItem edit mode (onClick restores original title, sets isEditing = false)
- [ ] T073 [US4] Implement update handler in TaskItem (call PATCH /api/users/{user_id}/tasks/{task_id} via API client, update local state)
- [ ] T074 [US4] Display validation error in TaskItem edit mode (show error message if title empty after trim, inline below input field)
- [ ] T075 [US4] Ensure updated title persists after page refresh (backend persists to database, frontend refetches on mount)

**Checkpoint**: At this point, User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P5)

**Goal**: Users can permanently remove tasks from their list.

**Independent Test**: Create tasks, delete one, and verify it's removed from the list and doesn't reappear after refresh.

### Implementation for User Story 5

- [ ] T076 [US5] Create delete task endpoint in backend/src/api/tasks.py (DELETE /api/users/{user_id}/tasks/{task_id})
- [ ] T077 [US5] Implement DELETE /api/users/{user_id}/tasks/{task_id} endpoint (verify JWT, match user_id, verify task ownership, delete task, return 204 No Content)
- [ ] T078 [US5] Add task ownership verification in delete endpoint (query WHERE id = task_id AND user_id = authenticated_user, return 404 if not found)
- [ ] T079 [US5] Add delete button to TaskItem component in frontend/src/components/TaskItem.tsx (icon button, onClick shows confirmation dialog)
- [ ] T080 [US5] Add confirmation dialog to TaskItem component (modal or browser confirm, "Are you sure you want to delete this task?")
- [ ] T081 [US5] Implement delete handler in TaskItem (on confirm, call DELETE /api/users/{user_id}/tasks/{task_id} via API client, remove from local list)
- [ ] T082 [US5] Implement cancel handler in confirmation dialog (close dialog, no action taken)
- [ ] T083 [US5] Handle delete errors gracefully in TaskItem (display error message if request fails, keep task in list)
- [ ] T084 [US5] Ensure deleted task doesn't reappear after page refresh (backend deletes from database permanently)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T085 [P] Add loading states to all API calls (spinner or skeleton during fetch, create, update, delete, toggle)
- [ ] T086 [P] Add error handling for network failures (display friendly error message, retry button for failed requests)
- [ ] T087 [P] Add error handling for JWT expiration (redirect to /signin on 401, show "Session expired" message)
- [ ] T088 [P] Improve responsive design for mobile (375x667 viewport, stack layout, touch-friendly buttons)
- [ ] T089 [P] Improve responsive design for desktop (1920x1080 viewport, grid layout, hover states)
- [ ] T090 [P] Add visual feedback for user actions (success message on task created, updated, deleted, toggled)
- [ ] T091 [P] Implement proper error logging in backend (structured JSON logs, log auth failures, validation errors, database errors)
- [ ] T092 [P] Add security headers in backend (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options)
- [ ] T093 [P] Test CORS configuration (verify frontend can call backend, verify Authorization header allowed)
- [ ] T094 [P] Test JWT token expiration (verify token expires after 24 hours, verify frontend handles 401 gracefully)
- [ ] T095 [P] Test user isolation (create two users, verify User A cannot see User B's tasks, verify 403 on cross-user access attempt)
- [ ] T096 [P] Add input sanitization for special characters (HTML/script tags in task titles, prevent XSS)
- [ ] T097 [P] Add rate limiting to auth endpoints (limit signup/signin attempts to prevent brute force attacks)
- [ ] T098 [P] Create root README.md (project overview, setup instructions, environment variables, running dev servers)
- [ ] T099 [P] Create backend/README.md (backend-specific setup, API documentation link, database migration instructions)
- [ ] T100 [P] Create frontend/README.md (frontend-specific setup, Better Auth configuration, environment variables)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Auth**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2) - Create/View Tasks**: Can start after Foundational (Phase 2) - No dependencies on other stories (auth is foundational)
- **User Story 3 (P3) - Toggle Completion**: Depends on User Story 2 (needs task list to toggle) - Should implement sequentially after US2
- **User Story 4 (P4) - Update Title**: Depends on User Story 2 (needs task list to edit) - Should implement sequentially after US2
- **User Story 5 (P5) - Delete Tasks**: Depends on User Story 2 (needs task list to delete) - Should implement sequentially after US2

**Recommended Implementation Order**:
1. Setup → Foundational → US1 (MVP ready)
2. US2 (core functionality ready)
3. US3 → US4 → US5 (enhancements)
4. Polish

### Within Each User Story

- Backend endpoints before frontend components (API must exist before UI can call it)
- Core implementation before edge case handling
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001-T010) can run in parallel
- Most Foundational tasks can run in parallel:
  - Backend tasks (T011-T018) can run in parallel with Frontend tasks (T019-T022)
  - Database migration (T023-T024) can run after models (T011-T012)
- Within each user story:
  - Backend endpoint implementation and Frontend component creation can run in parallel
  - Different components within same story can run in parallel (e.g., SignupForm and SigninForm in US1)
- All Polish tasks (T085-T100) can run in parallel

---

## Parallel Example: User Story 1 (Auth)

```bash
# Launch backend and frontend tasks together:
Parallel Group 1 (after Foundational complete):
  Task: "T025 [P] [US1] Create Signup page in frontend/src/app/(auth)/signup/page.tsx"
  Task: "T026 [P] [US1] Create Signin page in frontend/src/app/(auth)/signin/page.tsx"
  Task: "T027 [P] [US1] Create SignupForm component in frontend/src/components/SignupForm.tsx"
  Task: "T028 [P] [US1] Create SigninForm component in frontend/src/components/SigninForm.tsx"

Then Sequential:
  Task: "T029 [US1] Integrate Better Auth signup in SignupForm component"
  Task: "T030 [US1] Integrate Better Auth signin in SigninForm component"
  # ... remaining integration tasks
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Auth)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Create account, sign out, sign back in
   - Verify JWT token in browser Network tab
   - Verify password validation
   - Verify duplicate email prevention
5. Deploy/demo if ready

**MVP Deliverables**: Users can sign up, sign in, sign out with JWT-based authentication

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Core functionality!)
4. Add User Story 3 → Test independently → Deploy/Demo (Progress tracking!)
5. Add User Story 4 → Test independently → Deploy/Demo (Edit capability!)
6. Add User Story 5 → Test independently → Deploy/Demo (Delete capability!)
7. Add Polish → Test all stories together → Deploy/Demo (Production ready!)

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Auth)
   - Developer B: User Story 2 (Create/View Tasks) - can start in parallel
   - Developer C: Setup documentation and polish tasks
3. After US1 and US2 complete:
   - Developer A: User Story 3 (Toggle)
   - Developer B: User Story 4 (Update)
   - Developer C: User Story 5 (Delete)
4. Stories complete and integrate independently

---

## Validation Checklist

**Format Validation**:
- ✅ All tasks use checklist format: `- [ ] [TaskID] [Labels] Description with file path`
- ✅ All user story tasks have [USN] label
- ✅ All parallel tasks have [P] label
- ✅ All tasks have exact file paths

**Coverage Validation**:
- ✅ All 5 user stories from spec.md have dedicated phases
- ✅ All entities from data-model.md have creation tasks (User, Task)
- ✅ All endpoints from contracts/ have implementation tasks
- ✅ All functional requirements from spec.md are covered

**Dependency Validation**:
- ✅ Setup phase has no dependencies
- ✅ Foundational phase blocks all user stories
- ✅ User stories have clear dependencies documented
- ✅ Each user story is independently testable

---

## Notes

- Tests are OPTIONAL per spec - not included in this task list
- All tasks include exact file paths for clarity
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

**Total Tasks**: 100 tasks
**Tasks per User Story**:
- Setup: 10 tasks
- Foundational: 14 tasks
- US1 (Auth): 14 tasks
- US2 (Create/View): 16 tasks
- US3 (Toggle): 9 tasks
- US4 (Update): 12 tasks
- US5 (Delete): 9 tasks
- Polish: 16 tasks

**Parallel Opportunities**: 40+ tasks marked [P] can run in parallel with others
**MVP Scope**: Setup + Foundational + US1 = 38 tasks for authentication MVP
**Core App**: Setup + Foundational + US1 + US2 = 54 tasks for full CRUD MVP