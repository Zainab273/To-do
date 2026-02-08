"""Task database model."""
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional


class Task(SQLModel, table=True):
    """Task entity representing a todo item owned by a user."""

    __tablename__ = "tasks"

    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True, nullable=False)
    user_id: UUID = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(max_length=500, nullable=False)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174001",
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "Buy groceries",
                "completed": False,
                "created_at": "2026-02-05T10:30:00Z",
                "updated_at": "2026-02-05T10:30:00Z"
            }
        }
