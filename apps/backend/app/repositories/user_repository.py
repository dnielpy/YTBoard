# app/repositories/user_repository.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import User
from app.schemas.schemas import UserCreate

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

    async def create(self, user_data: UserCreate) -> User:
        db_user = User(
            email=user_data.email, 
            password_hash=user_data.password
        )
        
        self.db.add(db_user)
        await self.db.commit()      
        await self.db.refresh(db_user) 
        
        return db_user
