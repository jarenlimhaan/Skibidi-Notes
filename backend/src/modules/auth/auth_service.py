from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

SECRET_KEY = "supersecret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class AuthService:

    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def create_access_token(self, data: dict, expires_delta=None):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(days=3))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def verify_password(self, plain, hashed):
        return self.pwd_context.verify(plain, hashed)

    def hash_password(self, password):
        return self.pwd_context.hash(password)

    def decode_token(self, token: str):
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def get_auth_service():
    return AuthService()
