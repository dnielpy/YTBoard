
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserBase (BaseModel):
    email: EmailStr

class UserCreate(BaseModel):
    password: str

class UserResponse(BaseModel):
    id:int
    createdAt:datetime
    model_config = ConfigDict(from_attributes=True)

