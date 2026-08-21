from fastapi import APIRouter, HTTPException

from app.repositories import societies as society_repository
from app.schemas.societies import SocietyCreate, SocietyUpdate

societies_router = APIRouter(tags=["societies"])

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
def create_society(society: SocietyCreate):
    existing_society = society_repository.get_society_by_name(society.society_name)

    if existing_society:
        raise HTTPException(
            status_code=400,
            detail="Society already exists"
        )

    return society_repository.create_society(society)

@societies_router.patch("/societies/{society_id}")
def update_society(society_id: int, society: SocietyUpdate):
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
def delete_society(society_id: int):
    deleted_society = society_repository.delete_society(society_id)

    if not deleted_society:
        raise HTTPException(
            status_code=404,
            detail="Society not found"
        )

    return {"message": "Society deleted"}