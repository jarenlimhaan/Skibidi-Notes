# External Imports
from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

# Internal Imports
from config.env import get_app_configs
from src.deps import get_db

from .user_service import UserService, get_user_service
from src.modules.auth.auth_service import AuthService, get_auth_service
from .user_schema import UserSchema, UserUpdateSchema

router = APIRouter()
app_config = get_app_configs()

"""
Get user endpoint
- This endpoint retrieves a user by their email.
- It returns a UserSchema object if the user is found.
- If the user is not found, it raises a 404 HTTPException.
"""


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


"""
Update user endpoint
- This endpoint allows updating user information.
- It requires the user ID and a UserUpdateSchema object containing the fields to be updated.
"""


@router.put("/{user_id}")
async def update_user(
    user_id: str,
    user_update: UserUpdateSchema,
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
    auth_service: AuthService = Depends(get_auth_service),
):
    user = await user_service.update(user_id, user_update, db, auth_service)
    if not user:
        raise HTTPException(status_code=500, detail="Something went wrong...")
    return user
