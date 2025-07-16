from fastapi import Depends, HTTPException, Request
from jose.exceptions import ExpiredSignatureError
from src.modules.auth.auth_service import AuthService, get_auth_service


async def get_current_user_from_cookie(
    request: Request,
    auth_service: AuthService = Depends(get_auth_service),
):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        payload = auth_service.decode_token(token)
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
