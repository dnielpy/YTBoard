from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class GoogleConnectRequest(BaseModel):
    code: str
    redirect_uri: str


class GoogleConnectResponse(BaseModel):
    account_id: int
    channel_id: str
    channel_handle: str
    channel_title: str
    thumbnail_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GoogleAuthUrlResponse(BaseModel):
    auth_url: str


class GoogleTokenData(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    expires_at: datetime
    token_type: str = "Bearer"
    scope: str = ""
