# External Imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Internal Imports
from .user_model import User
from .user_schema import UserCreateSchema

class UserService:

    async def get(self, username: str, db: AsyncSession):
        stmt = select(User).where(User.username == username)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str, db: AsyncSession):
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, createUserDTO: UserCreateSchema, db: AsyncSession):
        new_user = User(
            username=createUserDTO.username,
            email=createUserDTO.email,
            password=createUserDTO.password  
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return {"status": "Success", "user_id": new_user.id}


def get_user_service():
    return UserService()
