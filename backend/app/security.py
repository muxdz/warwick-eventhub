from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

from pwdlib import PasswordHash
from app.config import settings
from datetime import datetime, timedelta, timezone
from app.repositories import users as user_repository

import jwt

password_hash = PasswordHash.recommended()

algorithm = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
secret_key = settings.jwt_secret_key
minutes = int(settings.jwt_expire_minutes)

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(password: str, 
                    hashed_password: str
                    ) -> bool:
    return password_hash.verify(password, hashed_password)

def create_access_token(user_id: int) -> str:
    payload = {
        "user_id": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes)
    }

    token = jwt.encode(payload, secret_key, algorithm=algorithm)
    return token

def decode_access_token(token: str) -> dict:
    return jwt.decode(token, secret_key, algorithms=[algorithm])

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )

    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return decode_access_token(token)