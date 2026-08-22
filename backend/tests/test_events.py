from fastapi.testclient import TestClient

from app.main import app
from app.security import get_current_user
from datetime import datetime

client = TestClient(app)


def use_user(user_id: int):
    app.dependency_overrides[get_current_user] = lambda: {"user_id": str(user_id)}

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

def test_get_events_by_society():
    response = client.get("/events?society_id=1")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2

def test_get_events_by_society_not_found():
    response = client.get("/events?society_id=999")

    assert response.status_code == 404
    assert response.json()["detail"] == "No events found"

def test_get_events_by_start_after():
    response = client.get("/events?start_after=2026-09-10 10:00:00")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3

def test_get_events_by_start_not_found():
    response = client.get("/events?start_after=2026-11-10 13:00:00")

    assert response.status_code == 404
    assert response.json()["detail"] == "No events found"

def test_get_events_by_search_title():
    response = client.get("/events?search=Python")

    assert response.status_code == 200
    assert len(response.json()) == 1

def test_get_events_by_search_description():
    response = client.get("/events?search=Test")

    assert response.status_code == 200
    assert len(response.json()) == 3

def test_get_events_by_search_not_found():
    response = client.get("/events?search=eventthatdoesntexist")

    assert response.status_code == 404
    assert response.json()["detail"] == "No events found"

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
        "event_title": "Test Event",
        "event_location": "Rootes",
        "start_time": "2026-10-10 10:00:00+01",
        "end_time": "2026-10-10 12:00:00+01",
        "description": "Test description",
        "society_id": 1,
        "created_by_user_id": 1
    }

    response = client.post("/events", json=new_event)
    assert response.status_code == 201


    data = response.json()
    assert data["event_title"] == "Test Event"
    assert data["event_location"] == "Rootes"

    expected = datetime.fromisoformat("2026-10-10 10:00:00+01")
    actual = datetime.fromisoformat(data["start_time"])
    assert expected == actual

    expected = datetime.fromisoformat("2026-10-10 12:00:00+01")
    actual = datetime.fromisoformat(data["end_time"])
    assert expected == actual
  
    assert data["description"] == "Test description"
    assert data["society_id"] == 1
    assert data["created_by_user_id"] == 1
    assert "id" in data


def test_create_event_validation_error():
    response = client.post(
        "/events",
        json={
            "event_title": "Test Title"
        }
    )

    assert response.status_code == 422

def test_member_cannot_create_event():
    use_user(2)

    response = client.post(
        "/events",
        json={
            "event_title": "Member Event",
            "event_location": "FAB",
            "start_time": "2026-10-10 10:00:00+01",
            "society_id": 1
        }
    )

    assert response.status_code == 403

def test_organiser_can_create_event_for_their_society():
    use_user(2)

    response = client.post(
        "/events",
        json={
            "event_title": "Organiser Event",
            "event_location": "FAB",
            "start_time": "2026-10-10 10:00:00+01",
            "society_id": 2
        }
    )

    assert response.status_code == 201
    assert response.json()["created_by_user_id"] == 2

def test_update_event_partial():
    original_event = client.get("/events/1").json()

    og_updated_at = original_event["updated_at"]
    before = datetime.fromisoformat(og_updated_at)

    response = client.patch(
        "/events/1",
        json={
            "event_title": "Updated Event Title"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["event_title"] == "Updated Event Title"
    assert data["society_id"] == 1
    assert datetime.fromisoformat(data["updated_at"]) > before

def test_update_no_change():
    response = client.patch(
        "/events/1",
        json={}
    )

    assert response.status_code == 400

def test_update_null():
    original_event = client.get("/events/1").json()

    og_updated_at = original_event["updated_at"]
    before = datetime.fromisoformat(og_updated_at)

    response = client.patch(
        "/events/1",
        json={
            "event_title": None
        }
    )

    assert response.status_code == 422

    data = response.json()
    assert data["detail"][0]["loc"][-1] == "event_title"


def test_update_event_not_found():
    response = client.patch(
        "/events/999",
        json={
            "event_title": "Test Title"
        }
    )

    assert response.status_code == 404

def test_member_cannot_update_event():
    use_user(2)
    response = client.patch("/events/1", json={"event_title": "Not allowed"})
    assert response.status_code == 403

def test_society_organiser_can_update_another_creators_event():
    response = client.patch("/events/3", json={"event_title": "Organiser edit"})
    assert response.status_code == 200
    assert response.json()["event_title"] == "Organiser edit"

def test_delete_event():
    response = client.delete("/events/1")

    data = response.json()
    assert data["message"] == "Event deleted"

    response = client.get("/events/1")
    assert response.status_code == 404

def test_delete_event_not_found():
    response = client.delete("/events/999")
    assert response.status_code == 404

def test_member_cannot_delete_event():
    use_user(2)
    response = client.delete("/events/1")
    assert response.status_code == 403
    assert client.get("/events/1").status_code == 200

def test_update_after_deleting_lower_id():
    response = client.delete("/events/2")
    data = response.json()

    assert data["message"] == "Event deleted"

    response = client.patch(
        "/events/3",
        json = {
            "event_title": "New title"
        }
    )
    assert response.status_code == 200
    
    data = response.json()
    assert data["event_title"] == "New title"
