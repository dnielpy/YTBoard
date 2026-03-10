from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "YTBoard API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Auth
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:4000/en/auth/google/callback"
    GOOGLE_OAUTH_SCOPES: list[str] = [
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/yt-analytics.readonly",
        "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
    ]

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/ytboard_db"
    DATABASE_ECHO: bool = False

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
