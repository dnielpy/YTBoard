from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class AccountBase(BaseModel):
    platform_account_id: str
    handle: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class AccountCreate(AccountBase):
    access_token: str
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None


class AccountResponse(AccountBase):
    id: int
    user_id: int
    last_sync: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
