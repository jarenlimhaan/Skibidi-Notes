# External Exports
from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserSchema(BaseModel):
    id: UUID
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

class UserCreateSchema(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserUpdateSchema(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    oldPassword: Optional[str] = None 
    newPassword: Optional[str] = None