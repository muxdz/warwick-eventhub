from fastapi import APIRouter, HTTPException, Depends

from app.repositories import events as event_repository
from app.schemas.events import EventCreate, EventUpdate
from app.security import get_current_user

from datetime import datetime

events_router = APIRouter(tags=["events"])

@events_router.get("/events")
def get_events(
    society_id : int | None = None,
    start_after: datetime | None = None,
    search: str | None = None
    ):

    event = event_repository.get_all_events(
        society_id=society_id,
        start_after=start_after,
        search=search
    )

    if len(event) == 0:
        raise HTTPException(
            status_code=404,
            detail="No events found"
        )

    return event

@events_router.get("/events/{event_id}")
def get_event(event_id: int):
    event = event_repository.get_event_by_id(event_id)

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return event

@events_router.post("/events", status_code=201)
def create_event(event_data: EventCreate, current_user = Depends(get_current_user)):

    return event_repository.create_event(event_data)

@events_router.delete("/events/{event_id}")
def delete_event(event_id: int, current_user = Depends(get_current_user)):
    deleted_event = event_repository.delete_event(event_id)

    event = event_repository.get_event_by_id(event_id)
    
    if event["created_by_user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to delete this event"
        )

    if deleted_event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return {"message": "Event deleted"}
    
@events_router.patch("/events/{event_id}", status_code=200)
def update_event(event_id: int, event_data: EventUpdate, current_user = Depends(get_current_user)):
    updates = event_data.model_dump(exclude_unset=True)
    event = event_repository.get_event_by_id(event_id)

    if event["created_by_user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to update this event"
        )

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No updates provided"
        )

    updated_event = event_repository.update_event(event_id, updates)

    if updated_event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return updated_event