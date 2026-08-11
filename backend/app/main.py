from fastapi import FastAPI, HTTPException

app = FastAPI()

events = []

event1 = {
    "id": 1,
    "title": "Welcome Event",
    "society": "Rowing Society",
    "location": "Oculus"
}

event2 = {
    "id": 2,
    "title": "Meet the Exec Event",
    "society": "Badminton Society",
    "location": "Oculus"
}

event3 = {
    "id": 3,
    "title": "Painting Event",
    "society": "Painting Society",
    "location": "FAB"
}


events.append(event1)
events.append(event2)
events.append(event3)

@app.get("/health")
def get_health():
    return {"status": "ok"}

@app.get("/events")
def get_events():
    return events

@app.get("/events/{event_id}")
def get_event(event_id: int):
    for event in events:
        if event["id"] == event_id:
            return event
    raise HTTPException(status_code=404, detail="Item not found")




