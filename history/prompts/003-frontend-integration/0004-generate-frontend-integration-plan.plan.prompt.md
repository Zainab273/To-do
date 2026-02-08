---
id: 0004
title: Generate Frontend Integration Plan
stage: plan
date: 2026-02-07
surface: agent
model: claude-sonnet-4-5
feature: 003-frontend-integration
branch: 003-frontend-integration
user: zainab
command: /sp.plan
labels: ["frontend", "nextjs", "planning", "architecture", "better-auth", "integration"]
links:
  spec: specs/003-frontend-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-frontend-integration/plan.md
  - specs/003-frontend-integration/research.md (pre-existing)
  - specs/003-frontend-integration/data-model.md (pre-existing)
  - specs/003-frontend-integration/quickstart.md (pre-existing)
  - specs/003-frontend-integration/contracts/api-client.md (pre-existing)
tests:
  - Constitution Check validation (all gates passed)
  - Backend schema alignment verification (all types match)
---

## Prompt

```
/sp.plan Frontend Application & Integration

Objective:
Implement a responsive frontend for Todo app, fully integrated with backend API and authentication.

Step 1: Project Setup
- Create Next.js 16+ project using App Router
- Configure Better Auth client and environment variables
- Initialize global state for user authentication

Step 2: Layout & Navigation
- Build main layout with header, footer, and navigation
- Include login/signup pages
- Protect authenticated routes with redirect logic

Step 3: Task List Component
- Fetch tasks from GET /api/{user_id}/tasks
- Display tasks in a responsive list
- Show completed/incomplete state visually

Step 4: Task Form Component
- Create form for adding a new task
- Validate input before POSTing to /api/{user_id}/tasks
- Reset form after successful submission

Step 5: Task Item Component
- Allow toggling completion via PATCH endpoint
- Allow updating title via PUT endpoint
- Allow deletion via DELETE endpoint
- Reflect changes immediately in UI after API success

Step 6: JWT & API Integration
- Attach JWT token to all API requests in Authorization header
- Handle token expiry gracefully
- Show errors or success messages for API responses

Step 7: State Management
- Keep task list synchronized with backend after any operation
- Update UI automatically after task creation, update, toggle, or delete

Step 8: Styling & Responsiveness
- Apply responsive CSS for mobile and desktop
- Ensure accessibility basics (labels, button focus, color contrast)

Step 9: Testing & Validation
- Test full workflow: signup/login → CRUD tasks
- Validate API responses reflected correctly in UI
- Ensure user cannot see or modify tasks of other users
- Confirm compliance with sp.constitution, Spec 1 & Spec 2
```

## Response snapshot

Generated comprehensive implementation plan for Frontend Application & Integration (003-frontend-integration) building on pre-existing research and design artifacts from previous planning session.

**Planning Artifacts Verified**:
- ✅ research.md: 8 technical decisions documented with rationale
- ✅ data-model.md: TypeScript types aligned with backend schemas
- ✅ quickstart.md: Comprehensive testing guide (627 lines)
- ✅ contracts/api-client.md: API integration patterns defined

**Plan Contents**:

1. **Summary**: Next.js 16+ frontend with Better Auth + Backend API integration
2. **Technical Context**: TypeScript 5.x, Next.js 16+, Tailwind CSS, Better Auth SDK
3. **Constitution Check**: ✅ PASSED all 6 constitutional principles
   - Spec-Driven Development compliance verified
   - End-to-End Correctness confirmed (type alignment)
   - Security-First Architecture enforced (JWT tokens, no cross-user access)
   - Separation of Concerns maintained (frontend/backend/auth/data layers)
   - Reproducibility via artifacts (spec, plan, research, data-model, contracts)
   - Agent-Generated Code Only (nextjs-frontend-builder)

4. **Project Structure**: Web application pattern (frontend/ + backend/)
   - App Router pages: layout, tasks, login, signup
   - Components: TaskList, TaskItem, CreateTaskForm, EditTaskForm
   - Hooks: useTasks, useAuth
   - API Client: authenticatedFetch wrapper + CRUD functions

5. **Architecture Decisions** (5 key decisions):
   - Decision 1: Next.js App Router (modern routing, middleware support)
   - Decision 2: Minimal Dependencies (native fetch, React hooks, Tailwind)
   - Decision 3: Optimistic UI Updates (rollback on error)
   - Decision 4: Inline Error Handling (no toast library)
   - Decision 5: Mobile-First Responsive Design (Tailwind breakpoints)

6. **Component Architecture**:
   - Pages: 5 App Router pages (layout, home, tasks, login, signup)
   - UI Components: 5 reusable components (TaskList, TaskItem, forms, navigation)
   - Custom Hooks: useTasks (state management), useAuth (session wrapper)
   - API Layer: authenticatedFetch + 5 CRUD functions

7. **Implementation Sequence** (6 phases, priority-ordered):
   - Phase 2A: P1 MVP - Core Infrastructure (Next.js, auth, API client)
   - Phase 2B: P1 MVP - View Task List (display tasks, empty/loading/error states)
   - Phase 2C: P1 MVP - Create Tasks (form, validation, auto-update)
   - Phase 2D: P2 - Toggle Completion (optimistic updates, rollback)
   - Phase 2E: P3 - Update Titles (inline edit, validation)
   - Phase 2F: P3 - Delete Tasks (confirmation, error handling)
   - Phase 2G: Polish & Validation (full testing, success criteria)

8. **Dependencies**: Next.js 16+, React 19+, TypeScript 5.x, Tailwind CSS, Better Auth SDK
9. **Environment Configuration**: .env.local with API_BASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET
10. **Risks & Mitigations**: 4 risks identified with mitigation strategies
11. **Success Metrics**: All 5 user stories, 20 FRs, 10 SCs, constitutional compliance

**Readiness**: Plan complete and ready for `/sp.tasks` to generate actionable task list

## Outcome

- ✅ Impact: Complete implementation plan generated for Next.js frontend with architecture decisions, component design, and phased implementation sequence. All constitutional principles validated.
- 🧪 Tests: Constitution Check (14 compliance items verified), Backend schema alignment (6 types matched), Research decisions (8 questions resolved)
- 📁 Files: plan.md (750+ lines), research.md (verified), data-model.md (verified), quickstart.md (verified), contracts/api-client.md (verified)
- 🔁 Next prompts: `/sp.tasks` to generate dependency-ordered task list, `/sp.implement` to execute via specialized agents
- 🧠 Reflection: Leveraged pre-existing research and design artifacts from previous session. Plan focuses on minimal dependencies (native fetch, React hooks) and mobile-first responsive design. All technical unknowns resolved via research.md. Constitutional compliance verified across all 6 principles.

## Evaluation notes (flywheel)

- Failure modes observed: None - all Phase 0 and Phase 1 artifacts existed from previous session
- Graders run and results (PASS/FAIL): Constitution Check PASS (all 6 principles), Backend Alignment PASS (6/6 types), Technology Stack PASS (6/6 components)
- Prompt variant (if applicable): Standard /sp.plan workflow with pre-existing research artifacts
- Next experiment (smallest change to try): Generate tasks.md via /sp.tasks and validate task dependency ordering against user story priorities
