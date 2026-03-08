# app/repositories/account_repository.py
from datetime import datetime
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.models import Account, Platform


class AccountRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, account_id: int) -> Optional[Account]:
        query = select(Account).where(Account.id == account_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_user_and_platform(
        self, user_id: int, platform_id: int
    ) -> Optional[Account]:
        query = select(Account).where(
            Account.user_id == user_id,
            Account.platform_id == platform_id,
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_user_id(self, user_id: int) -> list[Account]:
        query = select(Account).where(Account.user_id == user_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(
        self,
        user_id: int,
        platform_id: int,
        platform_account_id: str,
        handle: str,
        access_token: str,
        refresh_token: Optional[str],
        token_expires_at: Optional[datetime] = None,
        avatar_url: Optional[str] = None,
    ) -> Account:
        db_account = Account(
            user_id=user_id,
            platform_id=platform_id,
            platform_account_id=platform_account_id,
            handle=handle,
            avatar_url=avatar_url,
            access_token=access_token,
            refresh_token=refresh_token,
            token_expires_at=token_expires_at,
        )
        self.db.add(db_account)
        await self.db.commit()
        await self.db.refresh(db_account)
        return db_account

    async def update_tokens(
        self,
        account_id: int,
        access_token: str,
        token_expires_at: Optional[datetime] = None,
        refresh_token: Optional[str] = None,
    ) -> Optional[Account]:
        account = await self.get_by_id(account_id)
        if not account:
            return None

        account.access_token = access_token
        if token_expires_at:
            account.token_expires_at = token_expires_at
        if refresh_token:
            account.refresh_token = refresh_token

        await self.db.commit()
        await self.db.refresh(account)
        return account

    async def delete(self, account_id: int) -> bool:
        account = await self.get_by_id(account_id)
        if not account:
            return False

        await self.db.delete(account)
        await self.db.commit()
        return True


class PlatformRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_name(self, name: str) -> Optional[Platform]:
        query = select(Platform).where(Platform.name == name)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_or_create(self, name: str) -> Platform:
        platform = await self.get_by_name(name)
        if platform:
            return platform

        platform = Platform(name=name)
        self.db.add(platform)
        await self.db.commit()
        await self.db.refresh(platform)
        return platform
