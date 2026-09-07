from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from app.password_validation import validate_password

class UserCreate(BaseModel):
    user_name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password(value)

class UserResponse(BaseModel):
    id: int
    user_name: str
    email: EmailStr
    created_at: datetime

class UserUpdate(BaseModel):
    user_name: str | None = None
    email: EmailStr | None = None

    @field_validator(
            "user_name",
            "email",
        )
    @classmethod
    def required_fields_cannot_be_null(cls, value):
        if value is None:
            raise ValueError("field cannot be null")
        return value

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        return validate_password(value)
