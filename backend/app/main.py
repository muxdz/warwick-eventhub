from fastapi import FastAPI

from app.routers.events import events_router
from app.routers.users import users_router
from app.routers.societies import societies_router
from app.routers.memberships import membership_routers
from app.routers.bookmarks import bookmarks_router

app = FastAPI()

app.include_router(events_router)
app.include_router(users_router)
app.include_router(societies_router)
app.include_router(membership_routers)
app.include_router(bookmarks_router)

@app.get("/health")
def get_health():
    return {"status": "ok"}
