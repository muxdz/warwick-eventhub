from pydantic import BaseModel

class EventCreate(BaseModel):
    event_title: str
    event_location: str
    start_time: str
    end_time: str | None = None
    description: str | None = None
    society_id: int
    created_by_user_id: int

class Event(EventCreate):
    id: int