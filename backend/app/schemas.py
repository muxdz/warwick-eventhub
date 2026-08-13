from pydantic import BaseModel

class Event(BaseModel):
    id: int
    title: str
    society: str
    location: str

class EventCreate(BaseModel):
    title: str
    society: str
    location: str

class EventUpdate(BaseModel):
    title: str | None = None
    society: str | None = None
    location: str | None = None