from fastapi import APIRouter, HTTPException, Depends

from app.repositories import events as event_repository
from app.repositories import memberships as membership_repository
from app.repositories import societies as society_repository
from app.schemas.events import EventCreate, EventUpdate
from app.security import get_current_user

from datetime import datetime

events_router = APIRouter(tags=["events"])


def require_organiser(society_id: int, user_id: int):
    membership = membership_repository.get_membership(society_id, user_id)

    if membership is None or membership["role"] != "organiser":
        raise HTTPException(
            status_code=403,
            detail="You must be a society organiser to manage its events"
        )

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
    user_id = current_user["user_id"]

    if society_repository.get_society_by_id(event_data.society_id) is None:
        raise HTTPException(status_code=404, detail="Society not found")

    require_organiser(event_data.society_id, user_id)

    return event_repository.create_event(event_data, user_id)

@events_router.delete("/events/{event_id}")
def delete_event(event_id: int, current_user = Depends(get_current_user)):
    event = event_repository.get_event_by_id(event_id)

    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    require_organiser(event["society_id"], current_user["user_id"])

    deleted_event = event_repository.delete_event(event_id)

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

    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    require_organiser(event["society_id"], current_user["user_id"])

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
