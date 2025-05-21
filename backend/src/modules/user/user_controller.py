# External Imports 
from fastapi import Depends, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession

# Internal Imports 
from config.env import get_app_configs
from ...db.driver import get_db

from .user_service import UserService
from .user_schema import UserSchema

router = APIRouter()
app_config = get_app_configs()

def get_user_service():
    return UserService()

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    service: UserService = Depends(get_user_service)
):
    user = await service.get(user_id, db)
    print(user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user