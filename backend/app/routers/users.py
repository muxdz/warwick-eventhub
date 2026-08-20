from fastapi import APIRouter, HTTPException

from app.repositories import users as user_repository

from app.schemas.users import UserCreate

users_router = APIRouter(tags=["users"])

@users_router.get("/users")
def get_all_users():
    return user_repository.get_all_users()

@users_router.get("/users/{user_id}")
def get_user_by_id(user_id: int):
    return user_repository.get_user_by_id(user_id)

@users_router.get("/users/email/{email}")
def get_user_by_email(email: str):
    return user_repository.get_user_by_email(email)

@users_router.post("/users", status_code=201)
def create_user(user_data: UserCreate):
    existing_user = user_repository.get_user_by_email(user_data.email)

    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="User already exists"
        )

    # Password hashing
    password_hash = user_data.password + "test_hash"

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