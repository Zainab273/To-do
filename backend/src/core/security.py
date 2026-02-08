"""JWT token utilities for authentication."""
from jose import jwt, JWTError
import bcrypt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.core.config import settings
from typing import Dict, Any
from datetime import datetime, timedelta

security = HTTPBearer()

# ... (rest of the file)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Get current user ID from JWT token in Authorization header.

    Args:
        credentials: HTTPBearer credentials (automatically injected by FastAPI)

    Returns:
        User ID (UUID as string)

    Raises:
        HTTPException: 401 if token is invalid or missing
    """
    token = credentials.credentials
    user_id = extract_user_id(token)
    return user_id


def hash_password(password: str) -> str:
    """
    Hash password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password string
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against bcrypt hash.

    Args:
        plain_password: Password to verify
        hashed_password: Hashed password from database

    Returns:
        True if password matches, False otherwise
    """
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )


def create_access_token(user_id: str, email: str, expires_delta: timedelta = None) -> str:
    """
    Create JWT access token.

    Args:
        user_id: User ID (UUID as string)
        email: User email
        expires_delta: Token expiration time (default: 24 hours)

    Returns:
        JWT token string
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Default: 24 hours
        expire = datetime.utcnow() + timedelta(hours=24)

    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire
    }

    return jwt.encode(
        payload,
        settings.BETTER_AUTH_SECRET,
        algorithm="HS256"
    )


def decode_jwt(token: str) -> Dict[str, Any]:
    """
    Decode and verify JWT token.

    Args:
        token: JWT token string

    Returns:
        Dict containing token payload with user_id and email

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def extract_user_id(token: str) -> str:
    """
    Extract user ID from JWT token.

    Args:
        token: JWT token string

    Returns:
        User ID (UUID as string)

    Raises:
        HTTPException: 401 if token is invalid or user_id missing
    """
    payload = decode_jwt(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id
