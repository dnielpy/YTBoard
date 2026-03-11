from app.core.security import get_password_hash
from app.db.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status


async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    rep: UserRepository = UserRepository(db)

    existing_user = await rep.get_by_email(user_in.email)
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )

    hashed_password = get_password_hash(user_in.password)
    new_user = await rep.create(user_in.email, hashed_password)

    return new_user


async def get_user_by_email(email: str, db: AsyncSession = Depends(get_db)):
    rep: UserRepository = UserRepository(db)
    user = await rep.get_by_email(email)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User dont exists",
        )

    return user
