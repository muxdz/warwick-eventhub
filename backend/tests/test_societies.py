from fastapi.testclient import TestClient

from app.main import app
from app.security import get_current_user
from datetime import datetime

client = TestClient(app)


def use_user(user_id: int):
    app.dependency_overrides[get_current_user] = lambda: {"user_id": str(user_id)}

def test_get_all_societies():
    response = client.get("/societies")
    assert response.status_code == 200

def test_get_society_by_id():
    response = client.get("/societies/1")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == 1

def test_get_society_by_id_not_found():
    response = client.get("/societies/999")
    assert response.status_code == 404

def test_get_society_by_name():
    response = client.get("/societies/name/Cloud Society")
    assert response.status_code == 200

    data = response.json()
    assert data["society_name"] == "Cloud Society"

def test_get_society_by_name_not_found():
    response = client.get("/societies/name/definitelydoesnotexist")
    assert response.status_code == 404

def test_create_society():
    response = client.post(
        "/societies",
        json={
            "society_name": "test_society"
        }
    )
    assert response.status_code == 201

    data = response.json()
    assert data["society_name"] == "test_society"

    response = client.get("/societies/name/test_society")
    assert response.status_code == 200

def test_update_society():
    response = client.patch(
        "/societies/1",
        json={
            "society_name": "test_society_updated"
        }
    )
    assert response.status_code == 200

    data = response.json()
    assert data["society_name"] == "test_society_updated"

    response = client.get("/societies/name/test_society_updated")
    assert response.status_code == 200

def test_update_society_null():
    response = client.patch(
        "/societies/1",
        json={
            "society_name": None
        }
    )
    assert response.status_code == 422

def test_member_cannot_update_society():
    use_user(2)
    response = client.patch("/societies/1", json={"society_name": "Not allowed"})
    assert response.status_code == 403

def test_delete_society():
    response = client.delete("/societies/1")

    data = response.json()
    assert data["message"] == "Society deleted"

    response = client.get("/societies/1")
    assert response.status_code == 404

def test_delete_society_not_found():
    response = client.delete("/societies/999")
    assert response.status_code == 404

def test_member_cannot_delete_society():
    use_user(2)
    response = client.delete("/societies/1")
    assert response.status_code == 403

def test_organiser_can_update_membership_role():
    response = client.patch("/societies/1/members/2?role=organiser")
    assert response.status_code == 200
    assert response.json()["role"] == "organiser"
