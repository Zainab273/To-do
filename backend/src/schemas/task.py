"""Pydantic schemas for task request/response validation."""
from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from datetime import datetime


class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str = Field(..., min_length=1, max_length=500)

    @field_validator('title')
    def title_not_whitespace(cls, v):
        """Ensure title is not empty or whitespace-only."""
        if not v.strip():
            raise ValueError('Task title cannot be empty or whitespace')
        return v.strip()


class TaskUpdate(BaseModel):
    """Schema for updating task title."""
    title: str = Field(..., min_length=1, max_length=500)

    @field_validator('title')
    def title_not_whitespace(cls, v):
        """Ensure title is not empty or whitespace-only."""
        if not v.strip():
            raise ValueError('Task title cannot be empty or whitespace')
        return v.strip()


class TaskToggle(BaseModel):
    """Schema for toggling task completion status."""
    completed: bool


class TaskResponse(BaseModel):
    """Schema for task API responses."""
    id: UUID
    title: str
    completed: bool
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # For SQLModel compatibility
