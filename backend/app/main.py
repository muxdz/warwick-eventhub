from fastapi import FastAPI

from app.routers.events import events_router
from app.routers.users import users_router

app = FastAPI()

app.include_router(events_router)
app.include_router(users_router)

@app.get("/health")
def get_health():
    return {"status": "ok"}
