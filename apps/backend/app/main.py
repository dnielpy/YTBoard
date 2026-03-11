from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.api.v1.router import api_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)


def custom_openapi():
    """
    Configure HTTPBearer security scheme for Swagger UI.
    
    This enables the "Authorize" button in Swagger UI where users can
    paste their JWT token. The token is then automatically included in
    the Authorization header for all subsequent requests.
    """
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="YouTube Channel Management Dashboard API",
        routes=app.routes,
    )
    
    # Add HTTPBearer security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "HTTPBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token to authenticate requests",
        }
    }
    
    # Apply security to protected endpoints (all endpoints except /auth/login and /users/create)
    protected_paths = [
        "/accounts",
        "/videos",
    ]
    
    for path, path_item in openapi_schema.get("paths", {}).items():
        # Check if this path is protected
        is_protected = any(path.startswith(f"{settings.API_V1_STR}{protected}") for protected in protected_paths)
        
        if is_protected:
            for operation in path_item.values():
                if isinstance(operation, dict) and "operationId" in operation:
                    # Add security requirement to this operation
                    operation["security"] = [{"HTTPBearer": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
