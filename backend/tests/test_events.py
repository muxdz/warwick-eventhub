from fastapi.testclient import TestClient
import pytest

from app.main import app
from datetime import datetime

from app.database import get_connection

client = TestClient(app)

def seed_event(
    cur,
    title,
    location,
    society_id,
    created_by_user_id,
):
    cur.execute(
        """
        INSERT INTO events (
            event_title,
            event_location,
            start_time,
            end_time,
            description,
            society_id,
            created_by_user_id
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s);
        """,
        (
            title,
            location,
            "2026-10-10 10:00:00+01",
            "2026-10-10 12:00:00+01",
            "Test description",
            society_id,
            created_by_user_id
        )
    )

def seed_society(cur, society_name):
    cur.execute(
        """
        INSERT INTO societies (society_name)
        VALUES (%s);
        """,
        (society_name,)
    )

def seed_user(cur, user_name, email):
    cur.execute(
        """
        INSERT INTO users (user_name, email, password_hash)
        VALUES (%s, %s, 'test_hash');
        """,
        (user_name, email)
    )

@pytest.fixture(autouse=True)
def reset_events():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                TRUNCATE TABLE events, societies, users 
                RESTART IDENTITY CASCADE;
                """
            )

            seed_user(cur, "Alice", "alice@example.com")
            seed_user(cur, "Bob", "bob@example.com")

            seed_society(cur, "Cloud Society")
            seed_society(cur, "Engineering Society")

            seed_event(cur, "Python", "Rootes", 1, 1)
            seed_event(cur, "AWS", "FAB", 2, 2)
            seed_event(cur, "Docker", "FAB", 1, 2)

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

def test_update_event_partial():
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

def test_update_no_change():
    response = client.patch(
        "/events/1",
        json={}
    )

    assert response.status_code == 400

def test_update_null():
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