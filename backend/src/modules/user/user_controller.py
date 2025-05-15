# External Imports 
from fastapi import Depends, APIRouter

# Internal Imports 
from config.env import get_settings
from .user_service import UserService

router = APIRouter()
settings = get_settings()

def get_user_service():
    return UserService()

@router.get("/{user_id}")
def get_users(user_id: int, service: UserService = Depends(get_user_service)):
    # Calling Service methods 
    return service.get(user_id)