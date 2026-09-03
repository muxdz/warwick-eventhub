from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.repositories import users as user_repository

from app.schemas.users import UserCreate, UserUpdate, UserResponse

from app.security import hash_password, verify_password, get_current_user, create_access_token, oauth2_scheme

from typing import Annotated

users_router = APIRouter(tags=["users"])

@users_router.get("/users/me")
def get_me(current_user = Depends(get_current_user)):
    return current_user

@users_router.get("/users/me/data", status_code=200, response_model=UserResponse)
def get_me_data(current_user = Depends(get_current_user)):
    id = current_user["user_id"]
    return user_repository.get_user_by_id(id)

@users_router.post("/auth/login")
def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    email = form_data.username
    password = form_data.password

    if email is None or password is None:
        raise HTTPException(
            status_code=400,
            detail="Email and password are required"
        )

    user = user_repository.get_user_by_email(email)

    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect credentials"
        )

    token = create_access_token(user["id"])

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@users_router.get("/users/{user_id}")
def get_user_by_id(user_id: int):
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

@users_router.post("/auth/register", status_code=201)
def create_user(user_data: UserCreate):
    existing_user = user_repository.get_user_by_email(user_data.email)

    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="User already exists"
        )

    # Password hashing
    password_hash = hash_password(user_data.password)

    return user_repository.create_user(user_data, password_hash)