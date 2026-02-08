# Tasks: Frontend Application & Integration

**Input**: Design documents from `/specs/003-frontend-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-client.md, quickstart.md

**Tests**: No automated tests requested in specification - manual testing only (per quickstart.md)

**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with frontend/backend separation:
- **Frontend**: `frontend/src/`
- **Backend**: `backend/` (already implemented in Spec 002)
- All frontend tasks use `frontend/` as root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Next.js frontend project structure

- [X] T001 Initialize Next.js 16+ project with TypeScript in frontend/
- [X] T002 [P] Install core dependencies in frontend/package.json (next@16+, react@19+, react-dom@19+, typescript)
- [X] T003 [P] Install styling dependencies in frontend/package.json (tailwindcss, autoprefixer, postcss)
- [X] T004 [P] Install Better Auth React SDK in frontend/package.json (better-auth)
- [X] T005 Configure TypeScript in frontend/tsconfig.json with strict mode and path aliases
- [X] T006 [P] Configure Tailwind CSS in frontend/tailwind.config.js with mobile-first breakpoints
- [X] T007 [P] Create global styles in frontend/src/styles/globals.css with Tailwind imports
- [X] T008 [P] Create environment template in frontend/.env.example with API_BASE_URL and Better Auth config
- [X] T009 Create frontend/.env.local from template with development values
- [X] T010 [P] Configure Next.js in frontend/next.config.js with environment variables

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Create TypeScript type definitions in frontend/src/lib/api/types.ts (Task, TaskCreateRequest, TaskUpdateRequest, TaskToggleRequest, APIErrorResponse, LoadingState, TasksViewState, ValidationResult)
- [X] T012 Create validation utilities in frontend/src/lib/utils/validation.ts (validateTaskTitle, sanitizeTaskTitle functions)
- [X] T013 [P] Create date formatting utilities in frontend/src/lib/utils/formatting.ts (formatTaskDate function)
- [X] T014 Create API configuration in frontend/src/lib/api/config.ts (API_BASE_URL from env)
- [X] T015 Create authenticated fetch client in frontend/src/lib/api/client.ts (authenticatedFetch wrapper, APIError class, error helpers)
- [X] T016 Create Task API functions in frontend/src/lib/api/tasks.ts (getTasks, createTask, toggleTask, updateTask, deleteTask)
- [X] T017 Create API module exports in frontend/src/lib/api/index.ts
- [X] T018 [P] Create Better Auth hook in frontend/src/hooks/useAuth.ts (session and token access)
- [X] T019 Create root layout in frontend/src/app/layout.tsx with Better Auth SessionProvider
- [X] T020 Create home page in frontend/src/app/page.tsx with redirect to /tasks
- [X] T021 [P] Create login page in frontend/src/app/login/page.tsx with Better Auth integration
- [X] T022 [P] Create signup page in frontend/src/app/signup/page.tsx with Better Auth integration
- [X] T023 Create Next.js middleware in frontend/middleware.ts for protected routes (/tasks)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Task List (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can view all their tasks in a clean, organized list ordered by creation date

**Independent Test**: Log in, navigate to /tasks, verify task list displays with empty state or existing tasks. Verify responsive layout on mobile/tablet/desktop.

### Implementation for User Story 1

- [X] T024 [P] [US1] Create useTasks hook in frontend/src/hooks/useTasks.ts (state management for tasks, loading, error, fetchTasks function)
- [X] T025 [P] [US1] Create Container component in frontend/src/components/Layout/Container.tsx (responsive wrapper with padding)
- [X] T026 [P] [US1] Create Header component in frontend/src/components/Layout/Header.tsx (app title and user info)
- [X] T027 [US1] Create TaskList component in frontend/src/components/TaskList.tsx (empty state, loading skeleton, error display, task grid)
- [X] T028 [US1] Create task list page in frontend/src/app/tasks/page.tsx (use useTasks hook, render TaskList component)

**Checkpoint**: User Story 1 complete - users can view their task list with loading/error states and responsive layout

---

## Phase 4: User Story 2 - Create New Tasks (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can quickly create new tasks with client-side validation

**Independent Test**: Log in, navigate to /tasks, enter task title in form, submit, verify task appears at top of list. Test validation errors for empty/whitespace/long titles.

### Implementation for User Story 2

- [X] T029 [US2] Add createTask function to useTasks hook in frontend/src/hooks/useTasks.ts (optimistic update, error handling)
- [X] T030 [US2] Create CreateTaskForm component in frontend/src/components/CreateTaskForm.tsx (form state, validation, loading state, error display, submit handler)
- [X] T031 [US2] Integrate CreateTaskForm into task list page in frontend/src/app/tasks/page.tsx (add above TaskList component)

**Checkpoint**: User Stories 1 AND 2 complete - users can view and create tasks (MVP ready for deployment)

---

## Phase 5: User Story 3 - Toggle Task Completion (Priority: P2)

**Goal**: Authenticated users can mark tasks complete/incomplete to track progress

**Independent Test**: Create a task, click checkbox to toggle completion, verify visual state changes (strikethrough, color), verify state persists after page refresh. Test rollback on API error.

### Implementation for User Story 3

- [ ] T032 [US3] Add toggleTask function to useTasks hook in frontend/src/hooks/useTasks.ts (optimistic update with rollback on error)
- [ ] T033 [US3] Create TaskItem component in frontend/src/components/TaskItem.tsx (checkbox, title display, completion styling, date formatting, toggle handler)
- [ ] T034 [US3] Update TaskList component in frontend/src/components/TaskList.tsx to render TaskItem components in grid

**Checkpoint**: User Stories 1, 2, AND 3 complete - users can create, view, and toggle tasks

---

## Phase 6: User Story 4 - Update Task Titles (Priority: P3)

**Goal**: Authenticated users can edit task titles to fix typos or update plans

**Independent Test**: Create task, click edit button, change title, save, verify updated title displays. Test validation and cancel functionality.

### Implementation for User Story 4

- [ ] T035 [US4] Add updateTask function to useTasks hook in frontend/src/hooks/useTasks.ts (API call with error handling)
- [ ] T036 [US4] Create EditTaskForm component in frontend/src/components/EditTaskForm.tsx (inline edit mode, validation, save/cancel handlers)
- [ ] T037 [US4] Update TaskItem component in frontend/src/components/TaskItem.tsx to include edit button and EditTaskForm integration

**Checkpoint**: User Stories 1-4 complete - users can create, view, toggle, and update tasks

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P3)

**Goal**: Authenticated users can delete tasks to keep their list clean and focused

**Independent Test**: Create task, click delete button, confirm deletion prompt, verify task removed from list. Test cancel and error handling.

### Implementation for User Story 5

- [ ] T038 [US5] Add deleteTask function to useTasks hook in frontend/src/hooks/useTasks.ts (API call with error handling)
- [ ] T039 [US5] Update TaskItem component in frontend/src/components/TaskItem.tsx to add delete button with confirmation dialog

**Checkpoint**: All user stories (1-5) complete - full task management workflow functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T040 [P] Add responsive design polish across all components (verify 320px, 768px, 1024px breakpoints)
- [ ] T041 [P] Add loading skeletons for better perceived performance in TaskList component
- [ ] T042 [P] Add error boundary in frontend/src/app/layout.tsx for global error handling
- [ ] T043 Verify all 10 success criteria from spec.md (SC-001 through SC-010)
- [ ] T044 Run through quickstart.md manual testing workflow (all 8 test sections)
- [ ] T045 [P] Verify CORS configuration between frontend and backend
- [ ] T046 [P] Test authentication flow end-to-end (signup, signin, protected routes, token expiry)
- [ ] T047 Test all edge cases from spec.md (session expiry, network failures, long titles, etc.)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 8)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Depends on Foundational - Extends US1 but independently testable
- **User Story 3 (P2)**: Depends on Foundational - Enhances US1 components but independently testable
- **User Story 4 (P3)**: Depends on Foundational - Enhances US3 components but independently testable
- **User Story 5 (P3)**: Depends on Foundational - Enhances US3 components but independently testable

### Within Each User Story

- Components can be built in parallel if marked [P]
- Hook functions extend existing hooks (sequential updates)
- Each story builds on TaskList/TaskItem but maintains independent testability

### Parallel Opportunities

**Setup Phase (Phase 1):**
```bash
# Can run simultaneously:
T002, T003, T004  # All package installations
T005, T006, T007, T008, T010  # All configuration files
```

**Foundational Phase (Phase 2):**
```bash
# Can run simultaneously:
T011, T012, T013  # Type definitions and utilities (different files)
T018, T021, T022  # Auth-related components (different files)
```

**User Story Implementation:**
```bash
# After Foundational complete, can work in parallel:
- Developer A: User Story 1 (T024-T028)
- Developer B: User Story 2 (T029-T031)
- Developer C: User Story 3 (T032-T034)
```

**Polish Phase (Phase 8):**
```bash
# Can run simultaneously:
T040, T041, T042, T045, T046  # Different concerns
```

---

## Parallel Example: Foundational Phase

```bash
# Launch type definitions in parallel:
Task: "Create TypeScript type definitions in frontend/src/lib/api/types.ts"
Task: "Create validation utilities in frontend/src/lib/utils/validation.ts"
Task: "Create date formatting utilities in frontend/src/lib/utils/formatting.ts"

# Launch auth components in parallel:
Task: "Create Better Auth hook in frontend/src/hooks/useAuth.ts"
Task: "Create login page in frontend/src/app/login/page.tsx"
Task: "Create signup page in frontend/src/app/signup/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T010) → ~10 tasks
2. Complete Phase 2: Foundational (T011-T023) → ~13 tasks
3. Complete Phase 3: User Story 1 (T024-T028) → ~5 tasks
4. Complete Phase 4: User Story 2 (T029-T031) → ~3 tasks
5. **STOP and VALIDATE**: Test viewing and creating tasks independently
6. Deploy/demo MVP (31 tasks total)

### Incremental Delivery

1. MVP (US1 + US2): View and create tasks → Deploy
2. Add US3: Toggle completion → Deploy
3. Add US4: Update titles → Deploy
4. Add US5: Delete tasks → Deploy
5. Polish: Final validation and optimization → Deploy

### Parallel Team Strategy

With 3 developers after Foundational phase (T023 complete):

- **Developer A**: User Story 1 (T024-T028) → Task list display
- **Developer B**: User Story 2 (T029-T031) → Task creation
- **Developer C**: User Story 3 (T032-T034) → Task toggle

Stories integrate naturally through shared useTasks hook and components.

---

## Agent Assignment

All tasks use `nextjs-frontend-builder` agent per CLAUDE.md architecture guidelines:

- **T001-T010**: `nextjs-frontend-builder` (project setup)
- **T011-T023**: `nextjs-frontend-builder` (foundational infrastructure)
- **T024-T028**: `nextjs-frontend-builder` (US1 - task list display)
- **T029-T031**: `nextjs-frontend-builder` (US2 - task creation)
- **T032-T034**: `nextjs-frontend-builder` (US3 - task toggle)
- **T035-T037**: `nextjs-frontend-builder` (US4 - task update)
- **T038-T039**: `nextjs-frontend-builder` (US5 - task delete)
- **T040-T047**: `nextjs-frontend-builder` (polish and validation)

---

## Task Summary

**Total Tasks**: 47
**MVP Tasks (US1+US2)**: 31 (Setup + Foundational + US1 + US2)

**Tasks per User Story**:
- Setup: 10 tasks
- Foundational: 13 tasks
- User Story 1 (P1): 5 tasks
- User Story 2 (P1): 3 tasks → **MVP COMPLETE** (31 tasks)
- User Story 3 (P2): 3 tasks
- User Story 4 (P3): 3 tasks
- User Story 5 (P3): 2 tasks
- Polish: 8 tasks

**Parallel Opportunities**:
- Setup: 7 parallelizable tasks (marked [P])
- Foundational: 5 parallelizable tasks (marked [P])
- User Stories: All 5 stories can run in parallel after Foundational complete
- Polish: 5 parallelizable tasks (marked [P])

**Independent Test Criteria per Story**:
- US1: View task list with loading/error states and responsive layout
- US2: Create tasks with validation and immediate feedback
- US3: Toggle completion with optimistic updates and visual feedback
- US4: Edit task titles with inline forms and validation
- US5: Delete tasks with confirmation and error handling

---

## Notes

- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story] Description with file path`
- [P] tasks target different files with no dependencies
- [Story] labels (US1-US5) map to user stories from spec.md
- Each user story independently completable and testable
- No automated tests (manual testing per quickstart.md)
- All implementation via `nextjs-frontend-builder` agent
- Stop at any checkpoint to validate story independently
- MVP scope: User Stories 1 & 2 (view and create tasks)
