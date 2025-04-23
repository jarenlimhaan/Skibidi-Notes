from fastapi import APIRouter
from config.env import get_settings

router = APIRouter()

settings = get_settings()

@router.get("/")
def read_root():
    print(settings)
    return {"message": "Welcome to the API"}

@router.get("/health")
def health_check():
    return {"status": "ok"}
