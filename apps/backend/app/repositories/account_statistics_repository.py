# app/repositories/account_statistics_repository.py
from typing import Optional

from app.models.models import AccountStatistics, PeriodType
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class AccountStatisticsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_account_and_period(
        self, account_id: int, period_type: PeriodType
    ) -> Optional[AccountStatistics]:
        query = select(AccountStatistics).where(
            AccountStatistics.account_id == account_id,
            AccountStatistics.period_type == period_type,
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_account_id(self, account_id: int) -> list[AccountStatistics]:
        query = select(AccountStatistics).where(
            AccountStatistics.account_id == account_id
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def upsert(
        self, account_id: int, period_type: PeriodType, **kwargs
    ) -> AccountStatistics:
        stats = await self.get_by_account_and_period(account_id, period_type)
        if stats:
            for key, value in kwargs.items():
                setattr(stats, key, value)
        else:
            stats = AccountStatistics(
                account_id=account_id, period_type=period_type, **kwargs
            )
            self.db.add(stats)

        await self.db.commit()
        await self.db.refresh(stats)
        return stats
