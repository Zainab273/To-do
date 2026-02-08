"""User database model."""
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    """User entity representing a registered user account."""

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    hashed_password: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "user@example.com",
                "created_at": "2026-02-05T10:30:00Z"
            }
        }
