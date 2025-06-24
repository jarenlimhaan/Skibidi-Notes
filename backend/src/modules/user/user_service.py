# External Imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Internal Imports
from .user_model import User

class UserService:

    async def get(self, username: str, db: AsyncSession):
        stmt = select(User).where(User.username == username)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str, db: AsyncSession):
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, username: str, email: str, password: str, db: AsyncSession):
        new_user = User(username=username, email=email, password=password)
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return {"status": "Success"}


def get_user_service():
    return UserService()
