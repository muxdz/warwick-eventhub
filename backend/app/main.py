from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg

from app.routers.events import events_router
from app.routers.users import users_router
from app.routers.societies import societies_router
from app.routers.memberships import membership_routers
from app.routers.bookmarks import bookmarks_router

from app.config import settings

from app.repositories.ready import check_ready
from app.rate_limit import AuthRateLimitMiddleware

app = FastAPI()

app.include_router(events_router)
app.include_router(users_router)
app.include_router(societies_router)
app.include_router(membership_routers)
app.include_router(bookmarks_router)

origins = [
    origin.strip() 
    for origin in settings.cors_origin.split(",")
]

app.add_middleware(AuthRateLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def get_health():
    return {"status": "ok"}

@app.get("/ready")
def get_ready():
    try:
        check_ready()
        return {"status": "ready"}
    except psycopg.Error:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )
