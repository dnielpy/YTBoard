from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.users import create_user, get_user_by_email
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.post("/create", response_model=UserResponse, status_code=201)
async def create_user_endpoint(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await create_user(user, db)


@router.get("/", response_model=UserResponse, status_code=200)
async def get_user_by_email_endpoint(email: str, db: AsyncSession = Depends(get_db)):
    return await get_user_by_email(email, db)
