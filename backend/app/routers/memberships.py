from fastapi import APIRouter, Depends

from app.repositories import memberships as membership_repository
from app.security import get_current_user

membership_routers = APIRouter(tags=["memberships"])

@membership_routers.get("/memberships")
def get_my_memberships(current_user=Depends(get_current_user)):
    return membership_repository.get_user_memberships(current_user["user_id"])
