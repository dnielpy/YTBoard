# app/repositories/user_repository.py
from app.models.models import User
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int) -> User | None:
        query = select(User).where(User.id == user_id)

        result = await self.db.execute(query)

        return result.scalars().first()

    async def get_by_email(self, email: str) -> User | None:
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create(self, email: str, password_hash: str) -> User:
        db_user = User(
            email=email,
            password_hash=password_hash,
        )

        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)

        return db_user
