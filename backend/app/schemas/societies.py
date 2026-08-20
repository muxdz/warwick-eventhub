from pydantic import BaseModel, EmailStr, field_validator

class SocietyCreate(BaseModel):
    society_name: str

class SocietyUpdate(BaseModel):
    society_name: str | None = None

    @field_validator(
            "society_name",
        )
    @classmethod
    def required_fields_cannot_be_null(cls, value):
        if value is None:
            raise ValueError("field cannot be null")
        return value