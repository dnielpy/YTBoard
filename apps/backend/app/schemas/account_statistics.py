from typing import Optional

from app.models.models import PeriodType
from pydantic import BaseModel, ConfigDict


class AccountStatisticsBase(BaseModel):
    period_type: PeriodType
    followers: int = 0
    total_views: int = 0
    total_revenue: Optional[float] = None
    total_min_watched: int = 0
    total_likes: int = 0


class AccountStatisticsCreate(AccountStatisticsBase):
    pass


class AccountStatisticsResponse(AccountStatisticsBase):
    id: int
    account_id: int

    model_config = ConfigDict(from_attributes=True)
