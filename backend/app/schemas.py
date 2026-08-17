from pydantic import BaseModel, field_validator

class EventCreate(BaseModel):
    event_title: str
    event_location: str
    start_time: str
    end_time: str | None = None
    description: str | None = None
    society_id: int
    created_by_user_id: int
    image_key: str | None = None

class EventUpdate(BaseModel):
    event_title: str | None = None
    event_location: str | None = None
    start_time: str | None = None
    end_time: str | None = None
    description: str | None = None
    image_key: str | None = None

    @field_validator(
        "event_title",
        "event_location",
        "start_time",
    )
    @classmethod
    def required_fields_cannot_be_null(cls, value):
        if value is None:
            raise ValueError("field cannot be null")
        return value

class Event(EventCreate):
    id: int