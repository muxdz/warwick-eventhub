from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    user_name: str
    email: EmailStr
    password: str