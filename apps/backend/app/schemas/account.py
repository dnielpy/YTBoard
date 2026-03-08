from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class AccountBase(BaseModel):
    platform_account_id: str
    handle: str
class AccountCreate(AccountBase):
    platform_id: int
    access_token: str
    refresh_token: Optional[str] = None

class AccountResponse(AccountBase):
    id: int
    user_id: int
    platform_id: int
    
    model_config = ConfigDict(from_attributes=True)