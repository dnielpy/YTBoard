from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=72)

class UserResponse(UserBase):
    id: int
    created_at: datetime 
    
    model_config = ConfigDict(from_attributes=True)