
from pydantic import BaseModel, ConfigDict

class PlatformBase(BaseModel):
    name: str

class PlatformCreate(PlatformBase):
    pass

class PlatformResponse(PlatformBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
