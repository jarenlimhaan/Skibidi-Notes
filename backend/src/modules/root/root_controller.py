from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def read_root():
    print(settings)
    return {"message": "Welcome to the API"}


@router.get("/health")
def health_check():
    return {"status": "ok"}
