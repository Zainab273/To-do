"""Task management API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import Session, select
from uuid import UUID
from datetime import datetime
from src.models.task import Task
from src.middleware.auth import get_current_user
from src.db.session import get_session
from src.schemas.task import TaskCreate, TaskUpdate, TaskToggle, TaskResponse


router = APIRouter(prefix="/api", tags=["tasks"])


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Create a new task for the authenticated user.

    Args:
        task_data: Task creation data (title)
        session: Database session
        current_user_id: Authenticated user ID from JWT

    Returns:
        TaskResponse: Created task with id, timestamps, etc.

    Raises:
        400: Invalid title (empty, whitespace, too long)
        401: Missing or invalid JWT token
    """
    task = Task(
        title=task_data.title,  # Already validated and trimmed by Pydantic
        user_id=UUID(current_user_id),
        completed=False,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("/tasks", response_model=list[TaskResponse])
def list_tasks(
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Retrieve all tasks for the authenticated user.

    Args:
        session: Database session
        current_user_id: Authenticated user ID from JWT

    Returns:
        list[TaskResponse]: User's tasks ordered by creation date (newest first)

    Raises:
        401: Missing or invalid JWT token
    """
    tasks = session.exec(
        select(Task)
        .where(Task.user_id == UUID(current_user_id))
        .order_by(Task.created_at.desc())
    ).all()
    return tasks


@router.patch("/tasks/{task_id}", response_model=TaskResponse)
def toggle_task_completion(
    task_id: UUID,
    toggle_data: TaskToggle,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Toggle task completion status.

    Args:
        task_id: UUID of task to update
        toggle_data: New completion status
        session: Database session
        current_user_id: Authenticated user ID from JWT

    Returns:
        TaskResponse: Updated task

    Raises:
        401: Missing or invalid JWT token
        403: Task belongs to different user
        404: Task not found
        422: Invalid UUID format
    """
    # Retrieve task
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Validate ownership
    if task.user_id != UUID(current_user_id):
        raise HTTPException(status_code=403, detail="Access forbidden")

    # Update completion status and timestamp
    task.completed = toggle_data.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task_title(
    task_id: UUID,
    update_data: TaskUpdate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Update task title.

    Args:
        task_id: UUID of task to update
        update_data: New title (validated)
        session: Database session
        current_user_id: Authenticated user ID from JWT

    Returns:
        TaskResponse: Updated task

    Raises:
        400: Invalid title (empty, whitespace, too long)
        401: Missing or invalid JWT token
        403: Task belongs to different user
        404: Task not found
        422: Invalid UUID format
    """
    # Retrieve task
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Validate ownership
    if task.user_id != UUID(current_user_id):
        raise HTTPException(status_code=403, detail="Access forbidden")

    # Update title and timestamp
    task.title = update_data.title  # Already validated by Pydantic
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: UUID,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Permanently delete a task.

    Args:
        task_id: UUID of task to delete
        session: Database session
        current_user_id: Authenticated user ID from JWT

    Returns:
        204 No Content on success

    Raises:
        401: Missing or invalid JWT token
        403: Task belongs to different user
        404: Task not found
        422: Invalid UUID format
    """
    # Retrieve task
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Validate ownership
    if task.user_id != UUID(current_user_id):
        raise HTTPException(status_code=403, detail="Access forbidden")

    # Delete task
    session.delete(task)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
