from fastapi import APIRouter, HTTPException

from app.repositories import users as user_repository

from app.schemas.users import UserCreate

users_router = APIRouter(tags=["users"])

@users_router.post("/users", status_code=201)
def create_user(user_data: UserCreate):
    # Password hashing
    password_hash = user_data.password + "test_hash"

    return user_repository.create_user(user_data, password_hash)