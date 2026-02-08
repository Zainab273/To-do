# Quickstart Guide: Multi-User Todo Application with Authentication

**Feature Branch**: `001-multi-user-todo-auth`
**Date**: 2026-02-08
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Research**: [research.md](./research.md)
**Data Model**: [data-model.md](./data-model.md)
**API Contracts**: [contracts/auth.openapi.yaml](./contracts/auth.openapi.yaml), [contracts/tasks.openapi.yaml](./contracts/tasks.openapi.yaml)

## Summary

This guide provides step-by-step instructions for setting up the development environment, running the frontend and backend services, and performing initial testing of the multi-user todo application with authentication.

---

## 1. Environment Setup

Before you begin, ensure you have the following installed:

-   **Node.js**: Version 18+ (LTS recommended)
-   **Python**: Version 3.11+
-   **Git**: For cloning the repository

**Steps**:

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd g-house(hack)/phase\ 2
    ```
2.  **Navigate to the project root**:
    ```bash
    # You should already be in 'g-house(hack)/phase 2'
    pwd
    ```

---

## 2. Backend Setup (FastAPI)

1.  **Navigate to the `backend` directory**:
    ```bash
    cd backend
    ```
2.  **Create and activate a Python virtual environment**:
    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```
3.  **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Create `.env` file**:
    Create a file named `.env` in the `backend/` directory based on `backend/.env.example`.
    You need to fill in `BETTER_AUTH_SECRET` (a strong, random string) and `DATABASE_URL` (your Neon PostgreSQL connection string).

    Example `backend/.env` content:
    ```
    BETTER_AUTH_SECRET="your_very_long_and_secure_random_jwt_secret_here"
    DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
    ```
    *Note: The `BETTER_AUTH_SECRET` must be the same string used in the frontend's `.env.local`.*

5.  **Run migrations (if applicable)**:
    *(This project uses SQLModel, migrations might be handled programmatically or via a separate tool like Alembic if configured. For initial setup, ensure your `schema.sql` is applied to your Neon DB.)*
    You might need to execute SQL commands from `schema.sql` directly on your Neon database if an automated migration system isn't in place.

6.  **Start the FastAPI server**:
    ```bash
    uvicorn src.main:app --reload
    ```
    The backend API should now be running, typically at `http://localhost:8000`. You can access the API documentation (Swagger UI) at `http://localhost:8000/docs`.

---

## 3. Frontend Setup (Next.js)

1.  **Navigate to the `frontend` directory**:
    ```bash
    cd ../frontend # Assuming you are in the backend directory, go up one and into frontend
    ```
2.  **Install Node.js dependencies**:
    ```bash
    npm install
    ```
3.  **Create `.env.local` file**:
    Create a file named `.env.local` in the `frontend/` directory based on `frontend/.env.local.example`.
    You need to fill in `BETTER_AUTH_SECRET` (the same strong, random string from your backend `.env`), and `NEXT_PUBLIC_API_URL` pointing to your backend.

    Example `frontend/.env.local` content:
    ```
    NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
    NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000/api/auth" # If Better Auth is served from Next.js itself
    BETTER_AUTH_SECRET="your_very_long_and_secure_random_jwt_secret_here"
    ```
    *Note: `NEXT_PUBLIC_API_BASE_URL` should match the address where your FastAPI backend is running.*

4.  **Configure Better Auth**:
    Ensure `frontend/src/lib/auth.ts` is correctly configured to use `BETTER_AUTH_SECRET` for JWT token handling. *(This step will be automated by the agent during implementation, just a verification point)*.

5.  **Start the Next.js development server**:
    ```bash
    npm run dev
    ```
    The frontend application should now be running, typically at `http://localhost:3000`.

---

## 4. Testing Authentication Flow

Once both frontend and backend are running:

1.  **Navigate to the signup page**: Open your browser and go to `http://localhost:3000/signup`.
2.  **Create an account**: Provide a valid email, password, and confirm password. Ensure the password meets the requirements (minimum 8 characters, at least one uppercase, one lowercase, one number).
3.  **Verify redirect**: After successful signup, you should be automatically signed in and redirected to your todo list (e.g., `/tasks` page).
4.  **Sign out**: Locate and click the sign out button (usually in a navigation bar). You should be redirected to the signin page.
5.  **Sign back in**: Go to `http://localhost:3000/signin` and use the credentials of the account you just created. You should be signed in and redirected to your todo list again.
6.  **Verify JWT token**:
    -   Open your browser's **Developer Tools** (usually F12).
    -   Go to the **Network** tab.
    -   Perform an action that makes an API request (e.g., sign in, or if tasks are implemented, create a task).
    -   Inspect the request headers for calls to your backend (`http://localhost:8000/api/...`).
    -   Confirm that the `Authorization` header is present and contains a `Bearer <JWT_TOKEN>`.

---

## 5. Testing User Isolation (Once tasks are implemented)

This section requires task management functionality to be implemented (which is part of the `002-backend-api-data` and `003-frontend-integration` features).

1.  **Create User A**: Follow step 4 to create a user account (e.g., `userA@example.com`).
2.  **Create tasks as User A**: While signed in as User A, create several todo tasks.
3.  **Sign out User A**.
4.  **Create User B**: Follow step 4 to create another user account (e.g., `userB@example.com`).
5.  **Verify User A's tasks are not visible**: While signed in as User B, navigate to the todo list page. You should *not* see any tasks created by User A. Your list should be empty (unless you've created tasks as User B).
6.  **Attempt to access User A's task as User B (requires direct API interaction)**:
    -   As User A, inspect the network requests and find the `task_id` of one of User A's tasks.
    -   As User B, use a tool like `curl` or Postman (or browser DevTools if frontend has a mechanism) to send a direct API request to update/delete User A's task, using User B's JWT token.
    -   Example (replace `TASK_ID_A` and `USER_B_JWT`):
        ```bash
        curl -X PATCH 
          http://localhost:8000/api/users/<USER_B_ID_FROM_JWT>/tasks/<TASK_ID_A> 
          -H "Authorization: Bearer <USER_B_JWT>" 
          -H "Content-Type: application/json" 
          -d '{"completed": true}'
        ```
    -   **Expected Result**: The backend should return a `403 Forbidden` error, indicating that User B cannot modify User A's task.

---

## 6. Environment Variables Reference

These are critical environment variables for the application:

-   **`BETTER_AUTH_SECRET`**:
    -   **Description**: A long, random, and secure string used to sign and verify JWT tokens.
    -   **Usage**: Must be identical in `backend/.env` and `frontend/.env.local`.
    -   **Security**: **NEVER commit this to version control.** Store it securely.
-   **`DATABASE_URL`**:
    -   **Description**: The connection string for your Neon PostgreSQL database.
    -   **Usage**: Required in `backend/.env`.
    -   **Security**: Contains credentials, **NEVER commit this to version control.**
-   **`NEXT_PUBLIC_API_BASE_URL`**:
    -   **Description**: The base URL of your FastAPI backend API.
    -   **Usage**: Required in `frontend/.env.local`. Accessible client-side.
    -   **Example**: `http://localhost:8000`
-   **`NEXT_PUBLIC_BETTER_AUTH_URL`**:
    -   **Description**: The endpoint where Better Auth's API routes are served (if integrated into Next.js API routes).
    -   **Usage**: Required in `frontend/.env.local`. Accessible client-side.
    -   **Example**: `http://localhost:3000/api/auth`

---

**Quickstart Status**: ✅ Complete
