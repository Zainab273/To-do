# Research & Technical Decisions: Multi-User Todo Application with Authentication

**Feature Branch**: `001-multi-user-todo-auth`
**Date**: 2026-02-08
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Summary

This document consolidates research findings and technical decisions for implementing the authentication and security layer of the multi-user todo application. It addresses key technical unknowns identified in `plan.md` to ensure a robust, secure, and performant solution.

---

## Research Objectives & Decisions

### 1. Better Auth JWT Configuration

**Question**: How to configure Better Auth to issue JWT tokens, define claims structure, and set expiration policy?

**Decision**: Better Auth React SDK will be configured to issue JWTs with `sub` (user_id), `email`, `iat`, and `exp` claims. The signing algorithm will be HS256, and the token will have a 24-hour expiration (`exp` claim). The secret for signing/verification will be provided via the `BETTER_AUTH_SECRET` environment variable.

**Rationale**:
-   **Standard Claims**: `sub` and `email` are essential for identifying the user and performing authorization checks. `iat` and `exp` are standard for JWT lifecycle management.
-   **HS256**: A symmetric algorithm suitable when the same secret can be securely shared between the issuer (Better Auth backend, implicitly used by the SDK) and the verifier (FastAPI backend).
-   **24-hour Expiration**: Provides a reasonable balance between security (limiting token lifetime) and user convenience (reducing frequent re-logins). Frontend will handle token refresh if implemented later, but for MVP, re-authentication is acceptable.
-   **Environment Variable**: Ensures the secret is not hardcoded and can be managed securely.

**Alternatives Considered**:
-   **Asymmetric Algorithms (e.g., RS256)**: Requires public/private key pairs. More complex setup for this scope, especially for a shared secret with a library like Better Auth which might abstract this. HS256 is simpler for direct secret sharing.
-   **Shorter/Longer Expiration**: Shorter (`e.g., 15m`) would be more secure but degrade UX; longer (`e.g., 7d`) would improve UX but reduce security. 24 hours is a common middle ground for web applications.

**References**:
-   [JWT Handbook - Claims](https://jwt.io/introduction)
-   [Better Auth Documentation (hypothetical)](https://better-auth.dev/docs/jwt-config)

---

### 2. FastAPI JWT Verification

**Question**: Best practices for JWT verification middleware using `python-jose` or similar library.

**Decision**: A custom FastAPI dependency, `get_current_user`, will be implemented within `backend/src/core/security.py`. This dependency will:
1.  Extract the JWT from the `Authorization: Bearer <token>` header.
2.  Verify the token's signature using `BETTER_AUTH_SECRET` via `python-jose.jwt.decode`.
3.  Validate the `exp` claim to ensure the token is not expired.
4.  Extract the `sub` (user ID) claim.
5.  Raise `HTTPException(401)` for missing, invalid, or expired tokens.
6.  Make the `user_id` available to route handlers.

This dependency will then be used in FastAPI routes for protected endpoints.

**Rationale**:
-   **FastAPI Dependencies**: Provides a clean, reusable, and testable way to enforce authentication and authorization.
-   **`python-jose`**: A widely used and actively maintained Python library for JWTs, supporting various algorithms including HS256.
-   **Specific Error Handling**: Returning 401 with appropriate messages is crucial for client-side handling and security (e.g., redirecting to login).
-   **User ID Extraction**: The primary purpose is to identify the authenticated user for data scoping.

**Alternatives Considered**:
-   **Middleware**: A full ASGI middleware could be used, but a dependency provides more granular control at the route level and integrates seamlessly with FastAPI's parameter injection.
-   **Another JWT Library**: `PyJWT` is another option, but `python-jose` is well-suited for cryptographic operations and integrates well with common frameworks.

**References**:
-   [FastAPI Security - OAuth2 with JWT](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)
-   [python-jose Documentation](https://python-jose.readthedocs.io/en/latest/jws/index.html)

---

### 3. Frontend API Client Pattern

**Question**: How to automatically attach JWT to Authorization header for all API requests?

**Decision**: A custom `authenticatedFetch` wrapper function will be created in `frontend/src/lib/api-client.ts`. This function will:
1.  Retrieve the current JWT token from the Better Auth session (or local storage/cookies, depending on Better Auth's strategy).
2.  Inject the token into the `Authorization: Bearer <token>` header for every request.
3.  Handle `401 Unauthorized` responses by clearing the local session and redirecting the user to the login page.
4.  Handle `403 Forbidden` responses by displaying a generic "Access Denied" error to the user.
5.  All API calls from frontend components will use this `authenticatedFetch` wrapper.

**Rationale**:
-   **Centralized Logic**: Prevents repetitive code for token management and error handling across multiple API calls.
-   **Automatic Token Injection**: Ensures all protected endpoints receive the necessary authentication header.
-   **Graceful 401 Handling**: Provides a smooth user experience by automatically redirecting to login when a session expires or is invalid.
-   **Better Auth Integration**: Leverages Better Auth's mechanism for storing and retrieving JWTs.

**Alternatives Considered**:
-   **`axios` or `SWR` with Interceptors**: While powerful, for this scope, a native `fetch` wrapper is sufficient and avoids adding another dependency.
-   **Manual Header Addition**: Highly error-prone and verbose, leading to duplicated code.

**References**:
-   [MDN Web Docs - Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
-   [Better Auth React SDK (hypothetical)](https://better-auth.dev/docs/react-sdk)

---

### 4. Neon PostgreSQL Connection

**Question**: Connection string format, connection pooling for serverless, async vs sync driver.

**Decision**:
-   **Connection String**: The `DATABASE_URL` environment variable will directly provide the Neon PostgreSQL connection string (e.g., `postgresql://user:password@host/database`).
-   **Driver**: `psycopg2-binary` will be used for synchronous operations with SQLModel. Since FastAPI is asynchronous, database operations will be run in a separate thread pool using FastAPI's `run_in_threadpool` or by ensuring database sessions are created and closed within each request scope.
-   **Connection Pooling**: SQLModel/SQLAlchemy will be configured with connection pooling, and for serverless environments like Neon, a short connection timeout will be set to avoid stale connections. `get_session` dependency will handle session lifecycle.

**Rationale**:
-   **Neon Compatibility**: `psycopg2` is a standard PostgreSQL adapter compatible with Neon.
-   **SQLModel Integration**: SQLModel builds on SQLAlchemy, which has robust connection pooling.
-   **Serverless Best Practices**: Short connection timeouts and proper session management (creating and closing sessions per request) are crucial for serverless environments to handle ephemeral connections and avoid resource exhaustion.
-   **FastAPI Async**: While `psycopg2` is synchronous, wrapping calls in `run_in_threadpool` (or similar) allows the main event loop to remain unblocked. For simple CRUD, this is generally sufficient.

**Alternatives Considered**:
-   **`asyncpg`**: An asynchronous PostgreSQL driver. While ideal for fully async FastAPI, integrating with SQLModel/SQLAlchemy can be more complex than with `psycopg2` and `run_in_threadpool` for simpler setups.
-   **`SQLAlchemy-URL` with connection pooling settings**: This is part of the SQLModel approach.

**References**:
-   [Neon Docs - Connecting with Python](https://neon.tech/docs/connect/python)
-   [SQLAlchemy Connection Pooling](https://docs.sqlalchemy.org/en/14/core/pooling.html)
-   [FastAPI Databases](https://fastapi.tiangolo.com/advanced/async-sql-databases/)

---

### 5. Password Hashing

**Question**: Secure password hashing with `passlib` and `bcrypt` integration with Better Auth.

**Decision**:
-   **Better Auth (Frontend/Auth Service)**: Better Auth is assumed to handle password hashing securely during user registration. It will likely use a strong, modern hashing algorithm (e.g., bcrypt, Argon2) and store the hashed password in the database.
-   **FastAPI Backend**: The backend will *not* hash passwords directly. It will only receive JWTs for authentication. If a scenario arises where the backend needs to verify a raw password (e.g., password change), `passlib[bcrypt]` will be used to generate/verify hashes.

**Rationale**:
-   **Security Best Practice**: Passwords must *always* be hashed using a strong, slow, salt-generating algorithm like bcrypt before storage.
-   **Responsibility Delegation**: Delegating hashing to Better Auth simplifies the backend's role and ensures consistency with the authentication system.
-   **`passlib`**: A comprehensive password hashing library for Python, supporting many algorithms including bcrypt.

**Alternatives Considered**:
-   **Manual Hashing**: Implementing hashing manually is error-prone and strongly discouraged.
-   **Other Hashing Algorithms**: `scrypt`, `Argon2` are also strong choices. Bcrypt is widely supported and secure enough for this application.

**References**:
-   [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
-   [Passlib Documentation](https://passlib.readthedocs.io/en/stable/)

---

### 6. CORS Configuration

**Question**: How to configure FastAPI CORS for Next.js frontend origin?

**Decision**: FastAPI's `CORSMiddleware` will be used in `backend/src/main.py`. It will be configured to:
1.  Allow requests from the specific `FRONTEND_URL` origin (configured via environment variable).
2.  Allow `GET`, `POST`, `PUT`, `PATCH`, `DELETE` methods.
3.  Allow `Authorization` and `Content-Type` headers.
4.  Allow `credentials` to support sending cookies (though JWTs are typically in headers, this is a safe default).

**Rationale**:
-   **Security**: Prevents unauthorized domains from making requests to the API.
-   **Functionality**: Enables the Next.js frontend (running on a different origin, e.g., `localhost:3000`) to communicate with the FastAPI backend (e.g., `localhost:8000`).
-   **FastAPI Built-in**: `CORSMiddleware` is a standard and easy-to-use solution provided by Starlette (which FastAPI is built upon).

**Alternatives Considered**:
-   **Allow All Origins (`*`)**: Rejected - security risk, suitable only for public APIs.
-   **Reverse Proxy (e.g., Nginx)**: Could handle CORS, but `CORSMiddleware` is simpler for direct API setup.

**References**:
-   [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)

---

### 7. Environment Variable Management

**Question**: Best practices for sharing `BETTER_AUTH_SECRET` between frontend and backend.

**Decision**:
-   **`BETTER_AUTH_SECRET`**: Will be stored as an environment variable (`.env` file for development, platform-specific environment variables for deployment). It *must* be identical between the frontend's Better Auth configuration and the FastAPI backend's JWT verification.
-   **Frontend (`NEXT_PUBLIC_...`)**: Frontend-specific environment variables that need to be exposed to the browser (e.g., `NEXT_PUBLIC_API_BASE_URL`) will be prefixed with `NEXT_PUBLIC_` for Next.js to handle. Sensitive secrets like `BETTER_AUTH_SECRET` will *not* be exposed client-side (Better Auth SDK handles this internally, but the secret itself must be available to the build process or server-side rendering).
-   **Backend (`.env`)**: Python's `python-dotenv` will be used to load `.env` files for local development.

**Rationale**:
-   **Security**: Prevents hardcoding secrets in source code.
-   **Configuration Management**: Allows easy configuration changes between environments (development, staging, production).
-   **Next.js Best Practices**: Using `NEXT_PUBLIC_` prefix for client-side variables.
-   **Shared Secret**: Essential for Better Auth to issue JWTs that the FastAPI backend can verify.

**Alternatives Considered**:
-   **Hardcoding**: Rejected - major security risk.
-   **Dedicated Secret Management Service**: Overkill for this project scope, but good for larger applications.

**References**:
-   [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
-   [python-dotenv Documentation](https://pypi.org/project/python-dotenv/)

---

### 8. Error Handling Standards

**Question**: HTTP status code conventions for auth errors (401, 403, 422).

**Decision**: Adhere strictly to standard HTTP status codes and provide consistent JSON error responses:
-   **`401 Unauthorized`**: For missing, invalid, or expired JWT tokens. Response: `{"detail": "Authentication required"}` or `{"detail": "Invalid authentication credentials"}`.
-   **`403 Forbidden`**: For valid authentication but insufficient permissions (e.g., attempting to access another user's task). Response: `{"detail": "Insufficient permissions"}`.
-   **`422 Unprocessable Entity`**: For client-side validation failures (e.g., invalid email format, weak password, empty task title). FastAPI's Pydantic validation automatically returns this. Response will follow FastAPI's default validation error format, or a custom one if preferred, e.g., `{"detail": [{"loc": ["body", "email"], "msg": "value is not a valid email address", "type": "value_error.email"}]}`.
-   **`400 Bad Request`**: For general client errors not covered by 422 (e.g., malformed request body not caught by Pydantic, invalid UUID format for `task_id` if not handled by path params).
-   **`500 Internal Server Error`**: For unexpected server-side issues (e.g., database errors). Response: `{"detail": "An unexpected error occurred"}` (generic for security).

**Rationale**:
-   **API Consistency**: Predictable error responses make client-side error handling easier.
-   **Standard Compliance**: Using HTTP status codes as intended improves API usability and maintainability.
-   **Security**: Generic error messages for 500s prevent information disclosure.
-   **FastAPI Integration**: FastAPI handles many of these by default with `HTTPException` and Pydantic validation.

**Alternatives Considered**:
-   **Custom Error Codes**: Rejected - adds unnecessary complexity and deviates from HTTP standards.
-   **Always `200 OK` with Error in Body**: Rejected - anti-pattern, hides true HTTP status.

**References**:
-   [MDN Web Docs - HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
-   [FastAPI Error Handling](https://fastapi.tiangolo.com/tutorial/handling-errors/)

---

**Research Status**: ✅ Complete - All technical unknowns resolved and documented.