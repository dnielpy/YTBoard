from fastapi import APIRouter
from app.api.v1.endpoints import health, users, auth  

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"], prefix="/health")
api_router.include_router(users.router, tags=["Users"], prefix="/users")
api_router.include_router(auth.router, tags=["Auth"], prefix="/auth") # <--- CONECTAR AUTH
