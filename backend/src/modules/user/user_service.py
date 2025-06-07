# External Imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Internal Imports
from .user_model import User 

class UserService:
    
    async def get(self, user_id: int, db: AsyncSession):
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none() 
        return user