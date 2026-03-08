from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "YTBoard API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Auth
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/ytboard_db"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore" 


settings = Settings()
