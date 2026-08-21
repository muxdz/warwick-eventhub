from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer, Depends

from app.repositories import users as user_repository

from app.schemas.users import UserCreate, UserUpdate, UserResponse

from app.security import hash_password, verify_password, get_current_user

users_router = APIRouter(tags=["users"])

@users_router.get("/users/me")
def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@users_router.get("/users")
def get_all_users():
    return user_repository.get_all_users()

@users_router.get("/users/{user_id}")
def get_user_by_id(user_id: int):
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

@users_router.get("/users/email/{email}")
def get_user_by_email(email: str):
    user = user_repository.get_user_by_email(email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

@users_router.post("/auth/register", status_code=201, response_model=UserResponse)
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

@users_router.delete("/users/{user_id}")
def delete_user(user_id: int):
    deleted_user = user_repository.delete_user(user_id)

    if not deleted_user:
        raise HTTPException(
            status_code=404, 
            detail="User not found"
        )

    return {"message": "User deleted"}

@users_router.patch("/users/{user_id}", status_code=200)
def update_user(user_id: int, user_data: UserUpdate):
    updates = user_data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No updates provided"
        )

    updated_user = user_repository.update_user(user_id, updates)

    if updated_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return updated_user