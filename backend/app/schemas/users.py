from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
import re
import unicodedata

class UserCreate(BaseModel):
    user_name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        errors = []
        if len(value) < 10:
            errors.append("at least 10 characters")
        if not re.search(r"[A-Z]", value):
            errors.append("at least one uppercase letter (A-Z)")
        if not re.search(r"[a-z]", value):
            errors.append("at least one lowercase letter (a-z)")
        if not any(unicodedata.category(char)[0] in "PS" for char in value):
            errors.append("at least one symbol (e.g. !, @, #)")
        if errors:
            raise ValueError("Password must contain " + "; ".join(errors) + ".")
        return value

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
