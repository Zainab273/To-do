"""JWT authentication middleware."""
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.core.security import extract_user_id
from typing import Optional


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Verify JWT token and extract authenticated user ID.

    This dependency should be used on all protected routes to ensure:
    1. JWT token is present in Authorization header
    2. Token signature is valid
    3. Token is not expired
    4. User ID can be extracted from token

    Args:
        credentials: HTTP Bearer credentials from Authorization header

    Returns:
        User ID (UUID as string) from JWT 'sub' claim

    Raises:
        HTTPException: 401 if token is missing, invalid, or expired

    Example:
        @app.get("/api/users/{user_id}/tasks")
        async def get_tasks(
            user_id: str,
            authenticated_user: str = Depends(get_current_user)
        ):
            if user_id != authenticated_user:
                raise HTTPException(status_code=403, detail="Forbidden")
            # ... return tasks for authenticated_user
    """
    try:
        token = credentials.credentials
        user_id = extract_user_id(token)
        return user_id
    except HTTPException:
        # Re-raise HTTP exceptions from security module
        raise
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
