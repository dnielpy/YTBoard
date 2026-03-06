from app.schemas.user import UserCreate
from app.models.models import User
from app.core.security import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends, HTTPException
from starlette import status
from app.db.database import get_db


async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == user_in.email)
    result = await db.execute(query)
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )

    hashed_password = get_password_hash(user_in.password)

    new_user = User(
        email=user_in.email,
        password_hash=hashed_password,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user