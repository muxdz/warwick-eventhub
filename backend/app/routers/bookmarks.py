from fastapi import APIRouter, Depends, HTTPException

from app.repositories import bookmarks as bookmark_repository
from app.repositories import events as event_repository
from app.security import get_current_user


bookmarks_router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@bookmarks_router.get("")
def get_bookmarks(current_user=Depends(get_current_user)):
    return bookmark_repository.get_user_bookmarks(current_user["user_id"])


@bookmarks_router.post("/{event_id}", status_code=201)
def create_bookmark(event_id: int, current_user=Depends(get_current_user)):
    user_id = current_user["user_id"]

    if event_repository.get_event_by_id(event_id) is None:
        raise HTTPException(status_code=404, detail="Event not found")

    if bookmark_repository.get_bookmark(user_id, event_id):
        raise HTTPException(status_code=409, detail="Event already bookmarked")

    return bookmark_repository.create_bookmark(user_id, event_id)


@bookmarks_router.delete("/{event_id}")
def delete_bookmark(event_id: int, current_user=Depends(get_current_user)):
    deleted_bookmark = bookmark_repository.delete_bookmark(
        current_user["user_id"],
        event_id
    )

    if deleted_bookmark is None:
        raise HTTPException(status_code=404, detail="Bookmark not found")

    return {"message": "Bookmark deleted"}
