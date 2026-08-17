from pydantic import BaseModel

class Event(BaseModel):
    id: int
    title: str
    society: str
    location: str

class EventCreate(BaseModel):
    event_title: str
    event_location: str
    start_time: str
    end_time: str | None = None
    description: str | None = None
    society_id: int
    created_by_user_id: int

class EventUpdate(BaseModel):
    title: str | None = None
    society: str | None = None
    location: str | None = None