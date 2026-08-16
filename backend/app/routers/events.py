from fastapi import APIRouter, HTTPException

from app.repositories import events as event_repository

from app.schemas import Event, EventCreate, EventUpdate
from app.store import events

router = APIRouter(tags=["events"])

highest_id = max((event.id for event in events), default=0)

@router.get("/events")
def get_events():
    return event_repository.get_all_events()

@router.get("/events/{event_id}")
def get_event(event_id: int):
    event = event_repository.get_event_by_id(event_id)

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return event

@router.post("/events", response_model=Event, status_code=201)
def create_event(event_data: EventCreate):
    new_id = highest_id + 1
    new_event = Event(id=highest_id, **event_data.model_dump())
    events.append(new_event)
    return new_event

@router.delete("/events/{event_id}", status_code=204)
def delete_event(event_id: int):
    for event in events:
        if event.id == event_id:
            events.remove(event)
            return None
    raise HTTPException(status_code=404, detail="Event not found")
    
@router.patch("/events/{event_id}", response_model=Event, status_code=200)
def update_event(event_id: int, event_data: EventUpdate):
    for index, event in enumerate(events):
        if event.id == event_id:
            updated_data = event_data.model_dump(
                exclude_unset=True,
                exclude_none=True
                )
            existing_data = event.model_dump()
            existing_data.update(updated_data)
            updated_event = Event(**existing_data)

            events[index] = updated_event
            return updated_event
    raise HTTPException(status_code=404, detail="Event not found")