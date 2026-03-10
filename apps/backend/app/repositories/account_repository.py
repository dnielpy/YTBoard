# app/repositories/account_repository.py
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Account


class AccountRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, account_id: int) -> Optional[Account]:
        query = select(Account).where(Account.id == account_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_user_id(self, user_id: int) -> list[Account]:
        query = select(Account).where(Account.user_id == user_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_user(self, user_id: int) -> Optional[Account]:
        """Return the single YouTube account for a user (if any)."""
        query = select(Account).where(Account.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create(
        self,
        user_id: int,
        platform_account_id: str,
        handle: Optional[str] = None,
        title: Optional[str] = None,
        description: Optional[str] = None,
        image_url: Optional[str] = None,
        access_token: str = "",
        refresh_token: Optional[str] = None,
        token_expires_at: Optional[datetime] = None,
    ) -> Account:
        db_account = Account(
            user_id=user_id,
            platform_account_id=platform_account_id,
            handle=handle,
            title=title,
            description=description,
            image_url=image_url,
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

    async def update_last_sync(self, account_id: int) -> Optional[Account]:
        account = await self.get_by_id(account_id)
        if not account:
            return None

        account.last_sync = datetime.now(timezone.utc)
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
