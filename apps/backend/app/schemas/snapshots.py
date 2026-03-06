from pydantic import BaseModel, ConfigDict
from datetime import datetime

class AccountSnapshotBase(BaseModel):
    followers_count: int
    views_count: int
    video_count: int

class AccountSnapshotCreate(AccountSnapshotBase):
    pass

class AccountSnapshotResponse(AccountSnapshotBase):
    id: int
    date: datetime
    account_id: int
    model_config = ConfigDict(from_attributes=True)