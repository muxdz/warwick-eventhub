from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.schemas import Event
from app import store

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_events():
    store.events.clear()

    store.events.extend([
        Event(
            id = 1,
            title = "Welcome Event",
            society = "Society",
            location = "Oculus"
        ),
        Event(
            id = 2,
            title = "Meet the Exec Event",
            society = "Badminton Society",
            location = "Oculus"
        ),
        Event(
            id = 3,
            title = "Painting Event",
            society = "Painting Society",
            location = "FAB"
        )
    ])

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_events():
    response = client.get("/events")
    assert response.status_code == 200

    data = response.json()
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
        "title": "Test Event",
        "society": "Test Society",
        "location": "Rootes"
    }

    response = client.post("/events", json=new_event)
    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Test Event"
    assert data["society"] == "Test Society"
    assert data["location"] == "Rootes"
    assert "id" in data


def test_create_event_validation_error():
    response = client.post(
        "/events",
        json={
            "title": "Test Title"
        }
    )

    assert response.status_code == 422

def test_update_event_partial():
    response = client.patch(
        "/events/1",
        json={
            "title": "Updated Event Title"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Updated Event Title"
    assert data["society"] == "Society"

def test_update_no_change():
    response = client.patch(
        "/events/1",
        json={
            "title": None
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Welcome Event"
    assert data["society"] == "Society"

def test_update_event_not_found():
    response = client.patch(
        "/events/999",
        json={
            "title": "Test Title"
        }
    )

    assert response.status_code == 404

def test_delete_event():
    response = client.delete("/events/1")

    data = response.json()
    assert data["message"] == "Event deleted"

    response = client.get("/events/1")
    assert response.status_code == 404

def test_delete_event_not_found():
    response = client.delete("/events/999")
    assert response.status_code == 404

def test_update_after_deleting_lower_id():
    response = client.delete("/events/2")
    assert response.status_code == 204

    response = client.patch(
        "/events/3",
        json = {
            "title": "New title"
        }
    )
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "New title"