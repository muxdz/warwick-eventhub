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

@router.post("/events", status_code=201)
def create_event(event_data: EventCreate):
    return event_repository.create_event(event_data)

@router.delete("/events/{event_id}")
def delete_event(event_id: int):
    deleted_event = event_repository.delete_event(event_id)

    if deleted_event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return {"message": "Event deleted"}
    
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