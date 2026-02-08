"""Authentication request/response schemas."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class AuthSignupRequest(BaseModel):
    """Request schema for user signup."""

    email: EmailStr = Field(
        ...,
        min_length=5,
        max_length=255,
        description="User email address (must be valid email format)"
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="User password (minimum 8 characters)"
    )
    name: Optional[str] = Field(
        None,
        max_length=255,
        description="User name (optional)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123",
                "name": "John Doe"
            }
        }


class AuthSigninRequest(BaseModel):
    """Request schema for user signin."""

    email: EmailStr = Field(
        ...,
        min_length=5,
        max_length=255,
        description="User email address"
    )
    password: str = Field(
        ...,
        min_length=1,
        max_length=128,
        description="User password"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }


class AuthResponse(BaseModel):


    """Response schema for authentication operations."""





    token: str = Field(


        ...,


        description="JWT access token"


    )


    user: dict = Field(


        ...,


        description="User information"


    )





    class Config:


        json_schema_extra = {


            "example": {


                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",


                "user": {


                    "id": "123e4567-e89b-12d3-a456-426614174000",


                    "email": "user@example.com"


                }


            }


        }








class UserResponse(BaseModel):


    """Schema for returning basic user information."""


    id: str = Field(..., description="User ID (UUID as string)")


    email: EmailStr = Field(..., description="User email address")





    class Config:


        json_schema_extra = {


            "example": {


                "id": "123e4567-e89b-12d3-a456-426614174000",


                "email": "user@example.com"


            }


        }

