# app/repositories/video_repository.py
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Video, VideoStatistics, PeriodType


class VideoRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, video_id: int) -> Optional[Video]:
        query = select(Video).where(Video.id == video_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_youtube_id(self, video_id: str) -> Optional[Video]:
        query = select(Video).where(Video.video_id == video_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_account_id(self, account_id: int) -> list[Video]:
        query = select(Video).where(Video.account_id == account_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(self, account_id: int, **kwargs) -> Video:
        db_video = Video(account_id=account_id, **kwargs)
        self.db.add(db_video)
        await self.db.commit()
        await self.db.refresh(db_video)
        return db_video

    async def delete(self, video_id: int) -> bool:
        video = await self.get_by_id(video_id)
        if not video:
            return False

        await self.db.delete(video)
        await self.db.commit()
        return True


class VideoStatisticsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_video_and_period(
        self, video_id: int, period_type: PeriodType
    ) -> Optional[VideoStatistics]:
        query = select(VideoStatistics).where(
            VideoStatistics.video_id == video_id,
            VideoStatistics.period_type == period_type,
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def upsert(
        self, video_id: int, period_type: PeriodType, **kwargs
    ) -> VideoStatistics:
        stats = await self.get_by_video_and_period(video_id, period_type)
        if stats:
            for key, value in kwargs.items():
                setattr(stats, key, value)
        else:
            stats = VideoStatistics(video_id=video_id, period_type=period_type, **kwargs)
            self.db.add(stats)

        await self.db.commit()
        await self.db.refresh(stats)
        return stats
