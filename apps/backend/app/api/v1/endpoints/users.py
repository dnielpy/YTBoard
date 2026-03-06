from fastapi import APIRouter, Depends
from app.schemas.user import UserResponse, UserCreate
from app.services.users import create_user
from app.db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.post("/create", response_model=UserResponse, status_code=201)
async def create_user_endpoint(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await create_user(user, db)
