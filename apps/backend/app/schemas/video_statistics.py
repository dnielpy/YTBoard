from typing import Optional

from app.models.models import PeriodType
from pydantic import BaseModel, ConfigDict


class VideoStatisticsBase(BaseModel):
    period_type: PeriodType
    total_views: int = 0
    followers_gained: int = 0
    likes: int = 0
    estimated_revenue: Optional[float] = None


class VideoStatisticsCreate(VideoStatisticsBase):
    pass


class VideoStatisticsResponse(VideoStatisticsBase):
    id: int
    video_id: int

    model_config = ConfigDict(from_attributes=True)
