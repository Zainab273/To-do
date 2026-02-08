# Quickstart Guide: Frontend Application & Integration

**Feature**: 003-frontend-integration
**Date**: 2026-02-06
**Audience**: Developers setting up and testing the frontend application

---

## Prerequisites

### Required Software

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest version)

### Required Services

- **Backend API** (Spec 002): Must be running and accessible
  - Default URL: http://localhost:8000
  - Verify: `curl http://localhost:8000/health` should return `{"status":"healthy"}`

- **Better Auth** (Spec 001): Must be configured and functional
  - Authentication endpoints available
  - JWT token issuance working

---

## Initial Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

**Expected packages** (based on plan decisions):
- `next` (v16+)
- `react` (v19+)
- `react-dom` (v19+)
- `typescript`
- `tailwindcss`
- `better-auth` (React SDK)
- `@types/node`, `@types/react` (TypeScript types)

### 2. Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```bash
# Copy from example
cp .env.example .env.local

# Edit with your values
nano .env.local
```

**Required environment variables**:
```bash
# Backend API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Better Auth configuration
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth

# Better Auth secret (shared with backend)
BETTER_AUTH_SECRET=your-secret-key-here
```

**Production values**:
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com/api/auth
BETTER_AUTH_SECRET=<production-secret>
```

### 3. Start Development Server

```bash
npm run dev
```

**Expected output**:
```
> frontend@0.1.0 dev
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.5s
```

### 4. Verify Application

Open browser to http://localhost:3000

**Expected**:
- Home page loads
- Navigation to `/tasks` redirects to `/login` (if not authenticated)
- Login page displays Better Auth sign-in form

---

## Development Workflow

### Running the Application

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code (if prettier configured)
npm run format
```

### File Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with auth provider
│   │   ├── page.tsx            # Home/redirect page
│   │   ├── tasks/
│   │   │   └── page.tsx        # Task list page (main feature)
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── signup/
│   │       └── page.tsx        # Signup page
│   │
│   ├── components/             # Reusable UI components
│   │   ├── TaskList.tsx        # Task list display
│   │   ├── TaskItem.tsx        # Individual task
│   │   ├── CreateTaskForm.tsx  # Task creation form
│   │   └── EditTaskForm.tsx    # Task editing form
│   │
│   ├── lib/
│   │   ├── api/                # Backend API integration
│   │   │   ├── index.ts        # Main exports
│   │   │   ├── client.ts       # HTTP client with auth
│   │   │   ├── tasks.ts        # Task CRUD functions
│   │   │   └── types.ts        # TypeScript types
│   │   └── utils/              # Helper functions
│   │       ├── validation.ts   # Client-side validation
│   │       └── formatting.ts   # Date formatting
│   │
│   └── hooks/                  # Custom React hooks
│       ├── useTasks.ts         # Task list state management
│       └── useAuth.ts          # Authentication state
│
├── .env.local                  # Environment variables (gitignored)
├── .env.example                # Environment template
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## Testing Guide

### Manual Testing Workflow

#### 1. Authentication Testing

**Sign Up New User**:
1. Navigate to http://localhost:3000/signup
2. Enter email and password
3. Submit form
4. Verify redirect to `/tasks` after successful signup
5. Verify JWT token stored in browser (check DevTools → Application → Cookies/Local Storage)

**Sign In Existing User**:
1. Navigate to http://localhost:3000/login
2. Enter credentials
3. Submit form
4. Verify redirect to `/tasks`
5. Verify session persists after page refresh

**Protected Route**:
1. Open http://localhost:3000/tasks without authentication
2. Verify automatic redirect to `/login`
3. After login, verify redirect back to `/tasks`

---

#### 2. User Story 1: View Task List (P1 MVP)

**Test: Empty State**
1. Log in as new user (no existing tasks)
2. Navigate to `/tasks`
3. **Verify**: Empty state message displays
4. **Expected**: "No tasks yet. Create your first task to get started!" (or similar)

**Test: Task List Display**
1. Create a few tasks (see User Story 2)
2. Refresh page
3. **Verify**: All tasks display in list
4. **Verify**: Tasks ordered by creation date (newest first)
5. **Verify**: Each task shows:
   - Title
   - Completion checkbox (unchecked for new tasks)
   - Creation date (relative format, e.g., "5m ago")

**Test: Loading State**
1. Open DevTools → Network tab
2. Throttle network to "Slow 3G"
3. Refresh `/tasks` page
4. **Verify**: Loading skeleton or spinner displays
5. **Verify**: Tasks appear after loading completes

**Test: Error State**
1. Stop backend server
2. Refresh `/tasks` page
3. **Verify**: Error message displays
4. **Expected**: "Failed to load tasks. Please try again."
5. **Verify**: Retry button allows re-fetch
6. Restart backend, click retry
7. **Verify**: Tasks load successfully

**Test: Responsive Layout**
1. Open DevTools → Device Toolbar
2. Test at different widths:
   - **Mobile (375px)**: Single column layout, touch-friendly buttons
   - **Tablet (768px)**: Two column grid
   - **Desktop (1024px+)**: Three column grid
3. **Verify**: Layout adapts smoothly, no horizontal scrolling

---

#### 3. User Story 2: Create New Tasks (P1 MVP)

**Test: Valid Task Creation**
1. Navigate to `/tasks`
2. Enter task title: "Buy groceries"
3. Click "Add Task" or press Enter
4. **Verify**: Task appears at top of list immediately
5. **Verify**: Input field clears after creation
6. **Verify**: New task shows:
   - Title: "Buy groceries"
   - Completion: unchecked
   - Date: "just now"

**Test: Validation - Empty Title**
1. Leave title input empty
2. Click "Add Task"
3. **Verify**: Error message displays: "Task title cannot be empty"
4. **Verify**: No task created
5. **Verify**: Input field remains focused

**Test: Validation - Whitespace Only**
1. Enter title: "   " (spaces only)
2. Click "Add Task"
3. **Verify**: Error message displays: "Task title cannot be empty"
4. **Verify**: No task created

**Test: Validation - Trim Whitespace**
1. Enter title: "  Clean desk  "
2. Click "Add Task"
3. **Verify**: Task created with trimmed title: "Clean desk"

**Test: Validation - Max Length**
1. Enter title: 501 characters (generate long string)
2. **Verify**: Input field limits to 500 characters (maxLength attribute)
3. OR **Verify**: Error message on submit: "Task title must be 500 characters or less"

**Test: API Error Handling**
1. Stop backend server
2. Enter valid title: "Test task"
3. Click "Add Task"
4. **Verify**: Error message displays
5. **Expected**: "Failed to create task. Please try again."
6. **Verify**: Input value preserved ("Test task" still in field)
7. Restart backend, retry
8. **Verify**: Task created successfully

**Test: Loading State**
1. Throttle network to "Slow 3G"
2. Enter title, submit
3. **Verify**: Submit button disabled during request
4. **Verify**: Loading indicator displays (e.g., "Creating...")
5. **Verify**: Button re-enables after completion

---

#### 4. User Story 3: Toggle Task Completion (P2)

**Test: Mark Complete**
1. Create task "Test task"
2. Click checkbox next to task
3. **Verify**: Checkbox checks immediately (optimistic update)
4. **Verify**: Task visual state changes:
   - Title has strikethrough styling
   - Text color changes (e.g., gray)
   - Checkmark icon displays
5. **Verify**: Change persists after page refresh

**Test: Mark Incomplete**
1. Click checkbox on completed task
2. **Verify**: Checkbox unchecks immediately
3. **Verify**: Task visual state reverts:
   - Strikethrough removed
   - Normal text color restored
4. **Verify**: Change persists after page refresh

**Test: Optimistic Update with Rollback**
1. Stop backend server
2. Toggle task checkbox
3. **Verify**: UI updates immediately (optimistic)
4. **Verify**: After ~2 seconds, error message displays
5. **Verify**: Checkbox reverts to previous state (rollback)
6. **Expected error**: "Failed to update task. Please try again."

**Test: Performance**
1. Create task
2. Click checkbox
3. **Verify**: Visual update happens within 500ms (SC-003 requirement)
4. Measure with DevTools Performance tab if needed

**Test: 403 Forbidden (other user's task)**
_Note: Requires backend setup with multiple users_
1. Create task with User A
2. Manually copy task ID
3. Log in as User B
4. Attempt to toggle User A's task (via direct API call or URL manipulation)
5. **Verify**: 403 error message: "You do not have permission to modify this task"

---

#### 5. User Story 4: Update Task Title (P3)

**Test: Edit Task**
1. Create task "Original title"
2. Click edit button/icon on task
3. **Verify**: Inline edit mode activates
4. **Verify**: Input field displays with current title
5. Edit title to "Updated title"
6. Click save or press Enter
7. **Verify**: Title updates in list
8. **Verify**: Edit mode deactivates
9. **Verify**: Change persists after page refresh

**Test: Cancel Edit**
1. Click edit on task
2. Change title to "New title"
3. Click cancel or press Escape
4. **Verify**: Edit mode deactivates
5. **Verify**: Original title preserved (no change)

**Test: Validation - Empty Title**
1. Edit task
2. Clear title (delete all text)
3. Click save
4. **Verify**: Error message displays
5. **Expected**: "Task title cannot be empty"
6. **Verify**: Edit mode remains active
7. **Verify**: No update sent to backend

**Test: Validation - Whitespace Only**
1. Edit task
2. Enter "   " (spaces only)
3. Click save
4. **Verify**: Error message displays
5. **Verify**: No update sent

**Test: API Error Handling**
1. Edit task
2. Stop backend server
3. Enter valid new title, save
4. **Verify**: Error message displays
5. **Verify**: Edit mode remains active (can retry)
6. Restart backend, save again
7. **Verify**: Update succeeds

---

#### 6. User Story 5: Delete Tasks (P3)

**Test: Delete with Confirmation**
1. Create task "To be deleted"
2. Click delete button/icon
3. **Verify**: Confirmation prompt appears
4. **Expected**: "Are you sure you want to delete this task?"
5. Click "Confirm" or "Yes"
6. **Verify**: Task removed from list immediately
7. **Verify**: Deletion persists after page refresh

**Test: Cancel Deletion**
1. Click delete on task
2. Confirmation prompt appears
3. Click "Cancel" or "No"
4. **Verify**: Task remains in list (not deleted)

**Test: API Error Handling**
1. Stop backend server
2. Delete task, confirm
3. **Verify**: Error message displays
4. **Expected**: "Failed to delete task. Please try again."
5. **Verify**: Task remains in list (not removed)
6. Restart backend, retry
7. **Verify**: Deletion succeeds

**Test: 404 Not Found**
1. Create task
2. Delete task normally (succeeds)
3. Attempt to delete same task again (via API call with same ID)
4. **Verify**: 404 error: "Task not found"

---

### Browser DevTools Testing

#### Network Tab
1. Open DevTools → Network tab
2. Perform task operations
3. **Verify**:
   - `GET /api/tasks` on page load
   - `POST /api/tasks` on task creation
   - `PATCH /api/tasks/{id}` on toggle
   - `PUT /api/tasks/{id}` on title update
   - `DELETE /api/tasks/{id}` on deletion
4. **Verify**: All requests include `Authorization: Bearer <token>` header
5. **Verify**: Request/response payloads match API contract

#### Console Tab
1. Open DevTools → Console
2. **Verify**: No JavaScript errors during normal operation
3. **Verify**: Network errors logged appropriately
4. **Verify**: No sensitive data (tokens, passwords) in console logs

#### Application Tab
1. Open DevTools → Application
2. Check Cookies or Local Storage (depending on Better Auth config)
3. **Verify**: JWT token stored securely
4. **Verify**: Token includes user ID and expiry claims (decode at jwt.io)

---

### Responsive Design Testing

#### Mobile (320px - 639px)
```bash
# Use DevTools Device Toolbar or physical device
```

**Verify**:
- Single column layout
- Touch targets ≥ 44x44px
- Text readable without zoom
- Buttons accessible with thumb
- No horizontal scrolling
- Forms usable on small screen

#### Tablet (640px - 1023px)

**Verify**:
- Two column grid for tasks
- Comfortable spacing
- Touch-friendly UI
- Landscape orientation works

#### Desktop (1024px+)

**Verify**:
- Three column grid (or responsive width)
- Optimal use of space
- Hover states on buttons
- Keyboard navigation works

---

### Error Scenario Testing

#### Network Failures
1. Open DevTools → Network tab
2. Set "Offline" mode
3. Perform task operations
4. **Verify**: User-friendly error messages (not technical stack traces)
5. **Verify**: Ability to retry after reconnecting

#### Invalid JWT Token
1. Manually edit JWT token in browser storage (corrupt it)
2. Refresh `/tasks` page
3. **Verify**: Automatic redirect to `/login`
4. **Verify**: Session cleared

#### Expired JWT Token
_Note: Requires waiting for token expiry or manually setting expiry time_
1. Wait for token to expire (or manipulate expiry in storage)
2. Attempt task operation
3. **Verify**: 401 response handled
4. **Verify**: Redirect to `/login` with message: "Session expired. Please log in again."

#### Backend Unreachable
1. Stop backend server completely
2. Navigate to `/tasks`
3. **Verify**: Clear error message
4. **Expected**: "Unable to connect to server. Please try again later."
5. **Verify**: No infinite loading spinners

---

## Success Criteria Validation

Verify all 10 success criteria from spec.md:

- [ ] **SC-001**: Task list loads within 2 seconds (measure with Network tab)
- [ ] **SC-002**: Task creation completes within 1 second (measure with Performance tab)
- [ ] **SC-003**: Toggle completion updates within 500ms (measure with Performance tab)
- [ ] **SC-004**: Better Auth signup/signin flows work correctly
- [ ] **SC-005**: All API requests include JWT token (verify in Network tab)
- [ ] **SC-006**: Error messages display for all failure scenarios
- [ ] **SC-007**: Task list updates automatically without page refresh
- [ ] **SC-008**: UI responsive from 320px to 1920px (test all breakpoints)
- [ ] **SC-009**: Full workflow completable (create → view → toggle → update → delete)
- [ ] **SC-010**: Auth state persists across page refreshes

---

## Troubleshooting

### Common Issues

**Issue**: "Not authenticated" error on `/tasks`
- **Cause**: No JWT token in session
- **Solution**: Log in via `/login` first
- **Verify**: Token stored in browser (DevTools → Application)

**Issue**: "Failed to load tasks" error
- **Cause**: Backend not running or wrong `API_BASE_URL`
- **Solution**:
  1. Verify backend running: `curl http://localhost:8000/health`
  2. Check `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`
  3. Restart frontend: `npm run dev`

**Issue**: "CORS error" in console
- **Cause**: Backend CORS not configured for frontend origin
- **Solution**: Update backend `FRONTEND_URL` environment variable to `http://localhost:3000`

**Issue**: Tasks not updating after operations
- **Cause**: API request failing silently or state not updating
- **Solution**:
  1. Check Network tab for failed requests
  2. Check Console for JavaScript errors
  3. Verify `useTasks` hook refreshing state correctly

**Issue**: Validation errors not displaying
- **Cause**: Form validation not triggering
- **Solution**: Check `validateTaskTitle()` function is called before submit

**Issue**: Responsive layout broken
- **Cause**: Tailwind CSS not compiled or conflicting styles
- **Solution**:
  1. Verify Tailwind config correct
  2. Check `globals.css` imports Tailwind directives
  3. Restart dev server

---

## Performance Testing

### Load Time
```bash
# Use Chrome DevTools Lighthouse
1. Open DevTools → Lighthouse tab
2. Select "Performance" category
3. Click "Generate report"
4. Verify First Contentful Paint < 2s
5. Verify Time to Interactive < 3s
```

### Network Throttling
```bash
# Simulate slow network
1. DevTools → Network tab
2. Set throttling: "Slow 3G"
3. Verify app remains functional
4. Verify loading states display
5. Verify errors handled gracefully
```

### Large Data Sets
```bash
# Create many tasks (via backend)
1. Create 50-100 tasks
2. Navigate to /tasks
3. Verify page loads within acceptable time
4. Verify scrolling remains smooth
5. Verify memory usage reasonable (DevTools → Performance Monitor)
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Environment variables updated for production URLs
- [ ] Production build succeeds: `npm run build`
- [ ] Production build runs: `npm start`
- [ ] All environment secrets stored securely (not committed)
- [ ] CORS configured on backend for production frontend URL
- [ ] HTTPS enabled for production (frontend and backend)
- [ ] Error tracking configured (optional: Sentry, LogRocket)
- [ ] Performance tested with real network conditions
- [ ] All success criteria validated in production-like environment
- [ ] Better Auth configured for production domain

---

**Quickstart Guide Status**: ✅ Complete
**Next Steps**: Generate task list with `/sp.tasks` command
