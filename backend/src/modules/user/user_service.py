# External Imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Internal Imports
from .user_model import User
from .user_schema import UserCreateSchema

class UserService:

    async def get_by_id(self, user_id: int, db: AsyncSession):
        stmt = select(User).where(User.id == user_id)
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
    
    async def update(self, user_id: int, update_data: dict, db: AsyncSession):
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            return None

        for key, value in update_data.items():
            setattr(user, key, value)

        await db.commit()
        await db.refresh(user)
        return user

    async def delete(self, user_id: int, db: AsyncSession):
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            return {"status": "Not Found"}

        await db.delete(user)
        await db.commit()
        return {"status": "Deleted"}

    async def list_all(self, db: AsyncSession, limit: int = 50, offset: int = 0):
        stmt = select(User).offset(offset).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()


def get_user_service():
    return UserService()
