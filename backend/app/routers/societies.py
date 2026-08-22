from fastapi import APIRouter, HTTPException, Depends

from app.repositories import societies as society_repository
from app.repositories import memberships as membership_repository
from app.schemas.societies import SocietyCreate, SocietyUpdate
from app.security import get_current_user
from typing import Literal

societies_router = APIRouter(tags=["societies"])


def require_organiser(society_id: int, user_id: int):
    membership = membership_repository.get_membership(society_id, user_id)

    if membership is None or membership["role"] != "organiser":
        raise HTTPException(
            status_code=403,
            detail="You must be a society organiser to manage it"
        )

@societies_router.get("/societies")
def get_all_societies():
    return society_repository.get_societies()    

@societies_router.get("/societies/{society_id}")
def get_society_by_id(society_id: int):
    society = society_repository.get_society_by_id(society_id)

    if not society:
        raise HTTPException(
            status_code=404,
            detail="Society not found"
        )

    return society

@societies_router.get("/societies/name/{society_name}")
def get_society_by_name(society_name: str):
    society = society_repository.get_society_by_name(society_name)

    if not society:
        raise HTTPException(
            status_code=404,
            detail="Society not found"
        )

    return society

@societies_router.post("/societies", status_code=201)
def create_society(society_data: SocietyCreate, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]

    existing_society = society_repository.get_society_by_name(society_data.society_name)

    if existing_society:
        raise HTTPException(
            status_code=400,
            detail="Society already exists"
        )

    society = society_repository.create_society(society_data)

    society_id = society["id"]

    membership_repository.insert_membership(society_id, user_id, "organiser")

    return society

@societies_router.get("/societies/{society_id}/members")
def get_society_members(society_id: int, current_user=Depends(get_current_user)):
    require_organiser(society_id, current_user["user_id"])
    return membership_repository.get_society_members(society_id)

@societies_router.post("/societies/{society_id}/members/{user_id}", status_code=201)
def add_society_member(
    society_id: int,
    user_id: int,
    current_user=Depends(get_current_user)
):
    require_organiser(society_id, current_user["user_id"])
    return membership_repository.insert_membership(society_id, user_id, "member")

@societies_router.patch("/societies/{society_id}/members/{user_id}")
def update_membership(
    society_id: int,
    user_id: int,
    role: Literal["organiser", "member"],
    current_user=Depends(get_current_user)
):
    require_organiser(society_id, current_user["user_id"])
    return membership_repository.update_membership(society_id, user_id, role)

@societies_router.delete("/societies/{society_id}/members/{user_id}")
def remove_society_member(
    society_id: int,
    user_id: int,
    current_user=Depends(get_current_user)
):
    require_organiser(society_id, current_user["user_id"])
    return membership_repository.delete_membership(society_id, user_id)

@societies_router.patch("/societies/{society_id}")
def update_society(
    society_id: int,
    society: SocietyUpdate,
    current_user=Depends(get_current_user)
):
    if society_repository.get_society_by_id(society_id) is None:
        raise HTTPException(status_code=404, detail="Society not found")

    require_organiser(society_id, current_user["user_id"])
    updates = society.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No updates provided"
        )

    updated_society = society_repository.update_society(society_id, updates)

    if not updated_society:
        raise HTTPException(
            status_code=404,
            detail="Society not found"
        )

    return updated_society

@societies_router.delete("/societies/{society_id}")
def delete_society(society_id: int, current_user=Depends(get_current_user)):
    if society_repository.get_society_by_id(society_id) is None:
        raise HTTPException(status_code=404, detail="Society not found")

    require_organiser(society_id, current_user["user_id"])
    deleted_society = society_repository.delete_society(society_id)

    if not deleted_society:
        raise HTTPException(
            status_code=404,
            detail="Society not found"
        )

    return {"message": "Society deleted"}
