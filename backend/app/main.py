from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Event(BaseModel):
    id: int
    title: str
    society: str
    location: str

class EventCreate(BaseModel):
    title: str
    society: str
    location: str

event1 = Event(
    id = 1,
    title = "Welcome Event",
    society = "Rowing Society",
    location = "Oculus"
)

event2 = Event(
    id = 2,
    title = "Meet the Exec Event",
    society = "Badminton Society",
    location = "Oculus"
)

event3 = Event(
    id = 3,
    title = "Painting Event",
    society = "Painting Society",
    location = "FAB"
)

events = [event1, event2, event3]
highest_id = 3

@app.get("/health")
def get_health():
    return {"status": "ok"}

@app.get("/events", response_model=list[Event])
def get_events():
    return events

@app.get("/events/{event_id}", response_model=Event)
def get_event(event_id: int):
    for event in events:
        if event.id == event_id:
            return event
    raise HTTPException(status_code=404, detail="Event not found")

@app.post("/events", response_model=Event)
def create_event(event_data: EventCreate):
    global highest_id
    highest_id += 1
    new_event = Event(id=highest_id, **event_data)
    events.append(new_event)
    return new_event


