from fastapi import APIRouter
from app.api.v1.endpoints import health, users, auth, accounts, videos  

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"], prefix="/health")
api_router.include_router(users.router, tags=["Users"], prefix="/users")
api_router.include_router(auth.router, tags=["Auth"], prefix="/auth")
api_router.include_router(accounts.router, tags=["Account"], prefix="/account")
api_router.include_router(videos.router, tags=["Videos"], prefix="/videos")
