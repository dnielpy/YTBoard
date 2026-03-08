from fastapi import APIRouter
from app.api.v1.endpoints import health, users, auth, accounts  

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"], prefix="/health")
api_router.include_router(users.router, tags=["Users"], prefix="/users")
api_router.include_router(auth.router, tags=["Auth"], prefix="/auth")
api_router.include_router(accounts.router, tags=["Accounts"], prefix="/accounts")
