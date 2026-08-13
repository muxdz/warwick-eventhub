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

class EventUpdate(BaseModel):
    title: str | None = None
    society: str | None = None
    location: str | None = None

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
highest_id = max((event.id for event in events), default=0)

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

@app.post("/events", response_model=Event, status_code=201)
def create_event(event_data: EventCreate):
    global highest_id
    highest_id += 1
    new_event = Event(id=highest_id, **event_data.model_dump())
    events.append(new_event)
    return new_event

@app.delete("/events/{event_id}", status_code=200)
def delete_event(event_id: int):
    for event in events:
        if event.id == event_id:
            events.remove(event)
            return {"message": "Event deleted"}
    raise HTTPException(status_code=404, detail="Event not found")
    
@app.patch("/events/{event_id}", response_model=Event, status_code=200)
def update_event(event_id: int, event_data: EventUpdate):
    for index, event in enumerate(events):
        if event.id == event_id:
            updated_data = event_data.model_dump(exclude_unset=True)
            existing_data = event.model_dump()
            existing_data.update(updated_data)
            updated_event = Event(**existing_data)

            events[index] = update_event
            return updated_event
    raise HTTPException(status_code=404, detail="Event not found")
