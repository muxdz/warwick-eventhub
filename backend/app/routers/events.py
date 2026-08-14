from fastapi import APIRouter, HTTPException

from app.schemas import Event, EventCreate, EventUpdate
from app.store import events

router = APIRouter(tags=["events"])

highest_id = max((event.id for event in events), default=0)

@router.get("/events", response_model=list[Event])
def get_events():
    return events

@router.get("/events/{event_id}", response_model=Event)
def get_event(event_id: int):
    for event in events:
        if event.id == event_id:
            return event
    raise HTTPException(status_code=404, detail="Event not found")

@router.post("/events", response_model=Event, status_code=201)
def create_event(event_data: EventCreate):
    global highest_id
    highest_id += 1
    new_event = Event(id=highest_id, **event_data.model_dump())
    events.append(new_event)
    return new_event

@router.delete("/events/{event_id}", status_code=204)
def delete_event(event_id: int):
    for event in events:
        if event.id == event_id:
            events.remove(event)
            return {"message": "Event deleted"}
    raise HTTPException(status_code=404, detail="Event not found")
    
@router.patch("/events/{event_id}", response_model=Event, status_code=200)
def update_event(event_id: int, event_data: EventUpdate):
    for index, event in enumerate(events):
        if event.id == event_id:
            updated_data = event_data.model_dump(exclude_unset=True)
            existing_data = event.model_dump()
            existing_data.update(updated_data)
            updated_event = Event(**existing_data)

            events[index] = updated_event
            return updated_event
    raise HTTPException(status_code=404, detail="Event not found")