"""Environment configuration using pydantic-settings."""
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # JWT Secret (shared with frontend)
    BETTER_AUTH_SECRET: str = Field(
        ...,
        min_length=32,
        description="JWT secret key (must be at least 32 characters)"
    )

    # Database
    DATABASE_URL: str = Field(
        ...,
        description="Neon PostgreSQL connection string"
    )

    # CORS
    FRONTEND_URL: str = Field(
        default="http://localhost:3000",
        description="Frontend URL for CORS"
    )

    # Environment
    ENVIRONMENT: str = Field(
        default="development",
        description="Environment: development, staging, production"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()
