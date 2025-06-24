# External Imports
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

# Internal Imports
from .auth_service import AuthService
from src.modules.user.user_service import UserService
from .auth_schema import RegisterUserSchema, LoginUserSchema
from .guards.guard import get_current_user_from_cookie

from src.deps import get_db
from src.deps import get_user_service
from src.deps import get_auth_service

router = APIRouter()

@router.get("/authorized")
async def get_me(current_user=Depends(get_current_user_from_cookie)):
    return {"user": current_user}

@router.post("/register")
async def register(
    form_data: RegisterUserSchema,
    auth_service: AuthService = Depends(get_auth_service),
    user_service: UserService = Depends(get_user_service),
    db: AsyncSession = Depends(get_db),
):
    existing_user = await user_service.get_by_email(form_data.email, db)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = auth_service.hash_password(form_data.password)
    await user_service.create(form_data.username, form_data.email, hashed, db)
    return JSONResponse(content={"message": "Registration successful"})


@router.post("/login")
async def login(
    form_data: LoginUserSchema,
    auth_service: AuthService = Depends(get_auth_service),
    user_service: UserService = Depends(),
    db: AsyncSession = Depends(get_db),
):
    user = await user_service.get_by_email(form_data.email, db)
    if not user or not auth_service.verify_password(
        form_data.password, user.password
    ):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = auth_service.create_access_token({"sub": user.username})

    # Set as secure HTTP-only cookie
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token", value=token, httponly=True, secure=True, samesite="Lax"
    )
    return response

@router.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("access_token")
    return response
