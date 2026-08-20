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

