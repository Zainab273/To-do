"""Database session management for Neon PostgreSQL."""
from sqlmodel import create_engine, Session
from src.core.config import settings


# Create engine with Neon connection string
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",  # Log SQL queries in dev
    pool_pre_ping=True,  # Verify connections before use
    connect_args={"sslmode": "require"} if "sslmode" not in settings.DATABASE_URL else {}
)


def get_session():
    """
    Database session dependency for FastAPI routes.

    Yields:
        Session: SQLModel database session

    Example:
        @app.get("/tasks")
        def get_tasks(session: Session = Depends(get_session)):
            return session.exec(select(Task)).all()
    """
    with Session(engine) as session:
        yield session
