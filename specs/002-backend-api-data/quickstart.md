# Quickstart Guide: Backend API & Data Layer

**Feature**: Backend API & Data Layer for Todo Application
**Branch**: 002-backend-api-data
**Date**: 2026-02-05
**Audience**: Developers testing and integrating the task management API

## Overview

This guide shows how to test the Task Management API endpoints using FastAPI's built-in Swagger UI, curl commands, and integration with the frontend.

## Prerequisites

- Backend server running (`uvicorn src.main:app --reload`)
- Valid JWT token from user authentication
- Database migrated with User and Task tables

## Getting a JWT Token

### Option 1: Via Frontend

1. Start frontend: `npm run dev` (in frontend directory)
2. Sign in at `http://localhost:3000`
3. Open browser DevTools → Application → Cookies
4. Copy the `better-auth.session` cookie value
5. Decode at jwt.io to verify token structure

### Option 2: Via Direct Auth API

```bash
# Sign in and get token
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123"
  }'

# Response includes JWT token
```

**Note**: The exact authentication endpoint depends on Better Auth configuration. Use the frontend method for simplicity.

## Testing with FastAPI Swagger UI

### 1. Access the API Documentation

Navigate to `http://localhost:8000/docs`

### 2. Authorize with JWT Token

1. Click the green **Authorize** button (top right)
2. Enter your JWT token in the "Value" field: `Bearer <your-token-here>`
3. Click **Authorize**, then **Close**

All subsequent requests will include your token automatically.

### 3. Test Endpoints Interactively

#### Create a Task (POST /api/tasks)

1. Expand `POST /api/tasks`
2. Click **Try it out**
3. Edit the request body:
   ```json
   {
     "title": "Buy groceries"
   }
   ```
4. Click **Execute**
5. Verify response:
   - Status: `201 Created`
   - Body includes `id`, `title`, `user_id`, `completed: false`

#### List All Tasks (GET /api/tasks)

1. Expand `GET /api/tasks`
2. Click **Try it out** → **Execute**
3. Verify response:
   - Status: `200 OK`
   - Array of tasks (newest first)
   - Only your tasks appear (user isolation enforced)

#### Toggle Task Completion (PATCH /api/tasks/{task_id})

1. Copy a `task_id` from the list response
2. Expand `PATCH /api/tasks/{task_id}`
3. Click **Try it out**
4. Enter the `task_id` in the path parameter
5. Edit request body:
   ```json
   {
     "completed": true
   }
   ```
6. Click **Execute**
7. Verify:
   - Status: `200 OK`
   - Response shows `completed: true`
   - `updated_at` timestamp refreshed

#### Update Task Title (PUT /api/tasks/{task_id})

1. Expand `PUT /api/tasks/{task_id}`
2. Click **Try it out**
3. Enter `task_id`
4. Edit request body:
   ```json
   {
     "title": "Buy groceries and cook dinner"
   }
   ```
5. Click **Execute**
6. Verify:
   - Status: `200 OK`
   - Title updated in response

#### Delete Task (DELETE /api/tasks/{task_id})

1. Expand `DELETE /api/tasks/{task_id}`
2. Click **Try it out**
3. Enter `task_id`
4. Click **Execute**
5. Verify:
   - Status: `204 No Content`
   - No response body
   - Task removed from subsequent GET requests

---

## Testing with curl

Set your JWT token as an environment variable:

```bash
export JWT_TOKEN="your-token-here"
```

### Create a Task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries"
  }'
```

**Expected Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "completed": false,
  "created_at": "2026-02-05T15:30:00Z",
  "updated_at": "2026-02-05T15:30:00Z"
}
```

### List All Tasks

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Expected Response (200 OK)**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Buy groceries",
    "completed": false,
    "created_at": "2026-02-05T15:30:00Z",
    "updated_at": "2026-02-05T15:30:00Z"
  }
]
```

### Toggle Task Completion

```bash
TASK_ID="550e8400-e29b-41d4-a716-446655440001"

curl -X PATCH http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

**Expected Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "completed": true,
  "created_at": "2026-02-05T15:30:00Z",
  "updated_at": "2026-02-05T15:35:00Z"
}
```

### Update Task Title

```bash
curl -X PUT http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries and cook dinner"
  }'
```

### Delete Task

```bash
curl -X DELETE http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -v  # verbose to see 204 status
```

**Expected Response**: `204 No Content` (no response body)

---

## Error Scenarios

### Missing Token (401 Unauthorized)

```bash
curl -X GET http://localhost:8000/api/tasks
```

**Response**:
```json
{
  "detail": "Could not validate credentials"
}
```

### Invalid Task ID Format (400 Bad Request)

```bash
curl -X GET http://localhost:8000/api/tasks/invalid-id \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Response (422)**:
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

### Task Not Found (404)

```bash
curl -X GET http://localhost:8000/api/tasks/550e8400-e29b-41d4-a716-999999999999 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Response**:
```json
{
  "detail": "Task not found"
}
```

### Access Forbidden (403) - Another User's Task

```bash
# Try to access task owned by different user
curl -X GET http://localhost:8000/api/tasks/<other-user-task-id> \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Response**:
```json
{
  "detail": "Access forbidden"
}
```

### Empty Title (400 Bad Request)

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "   "
  }'
```

**Response**:
```json
{
  "detail": "Task title cannot be empty or whitespace"
}
```

### Title Too Long (422)

```bash
# Title with 501 characters
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"$(python3 -c 'print("A" * 501)')\"
  }"
```

**Response**:
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

---

## Frontend Integration

### TypeScript Type Definitions

Add to `frontend/src/lib/types.ts`:

```typescript
export interface Task {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
}

export interface TaskUpdate {
  title: string;
}

export interface TaskToggle {
  completed: boolean;
}
```

### API Client Usage

The existing `frontend/src/lib/api-client.ts` handles authentication automatically.

#### Create Task

```typescript
import { apiClient } from '@/lib/api-client';
import type { Task, TaskCreate } from '@/lib/types';

const newTask = await apiClient<Task>('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Buy groceries' } as TaskCreate),
});

console.log('Created:', newTask.id);
```

#### List Tasks

```typescript
const tasks = await apiClient<Task[]>('/api/tasks');
console.log(`You have ${tasks.length} tasks`);
```

#### Toggle Completion

```typescript
const updatedTask = await apiClient<Task>(`/api/tasks/${taskId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ completed: true }),
});
```

#### Update Title

```typescript
const updatedTask = await apiClient<Task>(`/api/tasks/${taskId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New title' }),
});
```

#### Delete Task

```typescript
await apiClient(`/api/tasks/${taskId}`, {
  method: 'DELETE',
});
// No response body (204 No Content)
```

### Error Handling in Frontend

```typescript
try {
  const task = await apiClient<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title: '' }),
  });
} catch (error) {
  if (error instanceof Response) {
    const errorData = await error.json();
    console.error('API Error:', errorData.detail);

    // Handle specific errors
    if (error.status === 401) {
      // Redirect to login (api-client does this automatically)
    } else if (error.status === 400 || error.status === 422) {
      // Show validation errors to user
      alert(errorData.detail);
    }
  }
}
```

---

## Debugging Tips

### Check Database Directly

```bash
# Connect to Neon PostgreSQL
psql "<your-neon-connection-string>"

# List all tasks for a user
SELECT * FROM tasks WHERE user_id = '<user-id-from-jwt>' ORDER BY created_at DESC;

# Count tasks per user
SELECT user_id, COUNT(*) FROM tasks GROUP BY user_id;
```

### Decode JWT Token

Visit https://jwt.io and paste your token to inspect:
- Header: algorithm (HS256)
- Payload: user_id, email, exp (expiration)
- Signature: verified with BETTER_AUTH_SECRET

### Check Server Logs

```bash
# Backend logs show all requests
cd backend
source venv/bin/activate
uvicorn src.main:app --reload --log-level debug
```

Look for:
- Authentication success/failure
- Database queries
- Error stack traces (for 500 errors)

### Test User Isolation

```bash
# Sign in as User A, create tasks, get token A
# Sign in as User B, create tasks, get token B

# Verify User A cannot see User B's tasks
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A"

# Response should NOT include User B's tasks
```

---

## Performance Testing

### Measure Response Times

```bash
# Time a list query
time curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -s -o /dev/null -w "%{time_total}\n"

# Expected: < 1 second for up to 100 tasks
```

### Load Testing with ab (Apache Bench)

```bash
# 100 requests, 10 concurrent
ab -n 100 -c 10 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8000/api/tasks
```

### Concurrent Updates

```bash
# Test race condition: toggle completion twice simultaneously
TASK_ID="..."
curl -X PATCH http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"completed": true}' &
curl -X PATCH http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"completed": false}' &
wait

# Verify final state (last write wins)
curl -X GET http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

## Common Issues

### "Could not validate credentials" (401)

**Cause**: Missing, invalid, or expired JWT token

**Solutions**:
- Verify token is included in Authorization header
- Check token hasn't expired (default: 24 hours)
- Re-sign in to get a fresh token
- Verify BETTER_AUTH_SECRET matches between frontend and backend

### "Access forbidden" (403)

**Cause**: Valid token but accessing another user's task

**Solutions**:
- Verify task_id belongs to authenticated user
- Check user_id in JWT matches task.user_id in database
- Ensure task wasn't deleted

### Connection Refused

**Cause**: Backend server not running

**Solution**:
```bash
cd backend
source venv/bin/activate
uvicorn src.main:app --reload
```

### Database Errors (500)

**Cause**: Database connection failure or constraint violation

**Solutions**:
- Verify DATABASE_URL is correct in backend/.env
- Check Neon database is active (not suspended)
- Review server logs for detailed error
- Verify foreign key integrity (user_id exists in users table)

---

## Next Steps

1. **Test All Endpoints**: Follow the Swagger UI or curl examples above
2. **Verify User Isolation**: Create users, test cross-user access (should fail with 403)
3. **Integrate with Frontend**: Use API client examples to build task management UI
4. **Monitor Performance**: Check response times stay under success criteria (<1-2 seconds)
5. **Error Handling**: Test all error scenarios to verify proper status codes and messages

---

**Quickstart Status**: ✅ **COMPLETE** - Ready for implementation and testing.
