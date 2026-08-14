from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.schemas import Event
from app.store import events as store

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_events():
    store.events.clear()

    store.events.extend([
        Event(
            id=1,
            name="Event 1",
            description="Original description"
        ),
        Event(
            id=2,
            name="Event 2",
            description="Another description"
        )
    ])

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_events():
    response = client.get("/events")
    assert response.status_code == 200

    data = response
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_event():
    
    response = client.get("/events/1")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == 1

def test_get_event_not_found():
    response = client.get("/events/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Event not found"

def test_create_event():
    new_event = {
        "name": "Test Event",
        "description": "This is a test event"
    }

    response = client.post("/events", json=new_event)
    assert response.status_code == 201

    data = response.json()
    assert data["name"] == "Test Event"
    assert data["description"] == "This is a test event"
    assert "id" in data


def test_create_event_validation_error():
    response = client.post(
        "/events",
        json={
            "description": "This is a test event"
        }
    )

    assert response.status_code == 422

def test_update_event_partial():
    response = client.patch(
        "/events/1",
        json={
            "name": "Updated Event"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Updated Event"
    assert data["description"] == "Original description"

def test_update_event_not_found():
    response = client.patch(
        "/events/999",
        json={
            "name": "Updated Event"
        }
    )

    assert response.status_code == 404

def test_delete_event():
    response = client.delete("/events/1")
    assert response.status_code == 204

    response = client.get("/events/1")
    assert response.status_code == 404

def test_delete_event_not_found():
    response = client.delete("/events/1")
    assert response.status_code == 404

