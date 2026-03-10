from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class VideoBase(BaseModel):
    video_id: str
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    published_at: Optional[datetime] = None
    duration: Optional[str] = None
    privacy: Optional[str] = None


class VideoCreate(VideoBase):
    pass


class VideoResponse(VideoBase):
    id: int
    account_id: int

    model_config = ConfigDict(from_attributes=True)
