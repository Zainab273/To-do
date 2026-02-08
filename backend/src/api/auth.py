"""Authentication API endpoints."""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from src.models.user import User
from src.db.session import get_session
from src.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from src.schemas.auth import AuthSignupRequest, AuthSigninRequest, AuthResponse, UserResponse
from uuid import UUID # Added UUID import


router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post(
    "/sign-up/email",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED
)
def signup(
    auth_data: AuthSignupRequest,
    session: Session = Depends(get_session)
):
    """
    Create new user account.

    Args:
        auth_data: Signup request with email and password
        session: Database session

    Returns:
        AuthResponse: JWT token and user information

    Raises:
        400: Email already registered
        422: Invalid email or password format (via Pydantic)
    """
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == auth_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = hash_password(auth_data.password)
    user = User(
        email=auth_data.email,
        hashed_password=hashed_password
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Generate JWT token
    token = create_access_token(
        user_id=str(user.id),
        email=user.email
    )

    return AuthResponse(
        token=token,
        user={
            "id": str(user.id),
            "email": user.email
        }
    )


@router.post("/sign-in/email", response_model=AuthResponse)
def signin(
    auth_data: AuthSigninRequest,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return JWT token.

    Args:
        auth_data: Signin request with email and password
        session: Database session

    Returns:
        AuthResponse: JWT token and user information

    Raises:
        401: Invalid email or password
        422: Invalid email or password format (via Pydantic)
    """
    # Find user by email
    user = session.exec(
        select(User).where(User.email == auth_data.email)
    ).first()

    if not user:
        # Don't reveal if email exists for security
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(auth_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate JWT token
    token = create_access_token(
        user_id=str(user.id),
        email=user.email
    )

    return AuthResponse(
        token=token,
        user={
            "id": str(user.id),
            "email": user.email
        }
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_details(
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Retrieve details of the currently authenticated user.

    Args:
        session: Database session
        current_user_id: Authenticated user ID from JWT

    Returns:
        UserResponse: Details of the current user

    Raises:
        401: Missing or invalid JWT token
        404: User not found (should not happen if token is valid)
    """
    user = session.exec(
        select(User).where(User.id == UUID(current_user_id))
    ).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserResponse(id=str(user.id), email=user.email)