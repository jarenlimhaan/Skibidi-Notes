# user/schema.py

from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


# What you return to the client
class UserSchema(BaseModel):
    id: UUID
    username: str
    email: EmailStr

    class Config:
        orm_mode = True
        from_attributes = True


# What the client sends to create a user
class UserCreateSchema(BaseModel):
    username: str
    email: EmailStr
    password: str
