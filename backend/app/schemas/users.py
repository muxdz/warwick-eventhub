from pydantic import BaseModel, EmailStr, field_validator

class UserCreate(BaseModel):
    user_name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    user_name: str
    email: EmailStr
    created_at: str

class UserUpdate(BaseModel):
    user_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None

    @field_validator(
            "user_name",
            "email",
            "password",
        )
    @classmethod
    def required_fields_cannot_be_null(cls, value):
        if value is None:
            raise ValueError("field cannot be null")
        return value