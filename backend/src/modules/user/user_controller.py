# External Imports
from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

# Internal Imports
from config.env import get_app_configs
from src.deps import get_db

from .user_service import UserService, get_user_service
from .user_schema import UserSchema

router = APIRouter()
app_config = get_app_configs()


@router.get("/{user_email}", response_model=UserSchema)
async def get_user(
    user_email: str,
    db: AsyncSession = Depends(get_db),
    service: UserService = Depends(get_user_service),
):
    user = await service.get_by_email(user_email, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
