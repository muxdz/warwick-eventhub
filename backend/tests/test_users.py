from fastapi.testclient import TestClient

from app.main import app
from datetime import datetime

client = TestClient(app)

def test_get_users():
    response = client.get("/users")
    assert response.status_code == 200

def test_get_user_by_id():
    response = client.get("/users/1")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == 1

def test_get_user_by_id_not_found():
    response = client.get("/users/999")

    data = response.json()

    assert response.status_code == 404
    assert data["detail"] == "User not found"

def test_get_user_by_email():
    response = client.get("/users/email/alice@example.com")
    assert response.status_code == 200

    data = response.json()
    assert data["email"] == "alice@example.com"

def test_get_user_by_email_not_found():
    response = client.get("/users/email/definitelydoesnotexist@example.com")

    data = response.json()

    assert response.status_code == 404
    assert data["detail"] == "User not found"


def test_create_user():
    response = client.post(
        "/users",
        json={
            "user_name": "test_username",
            "email": "test@example.com",
            "password": "test_password"
        }
    )
    data = response.json()

    assert response.status_code == 201
    assert data["user_name"] == "test_username"
    assert data["email"] == "test@example.com"

def test_create_user_missing_values():
    response = client.post(
        "/users",
        json={
            "user_name": "test_username"
        }
    )

    assert response.status_code == 422

def test_create_user_already_exists():
    response = client.post(
        "/users",
        json={
            "user_name": "Alice",
            "email": "alice@example.com",
            "password": "test_password"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "User already exists"

def test_update_username():
    response = client.patch(
        "/users/1",
        json={
            "user_name": "test_username"
        }
    )

    data = response.json()

    assert response.status_code == 200
    assert data["user_name"] == "test_username"

def test_user_update_email():
    response = client.patch(
        "/users/1",
        json={
            "email": "test@example.com"
        }
    )

    data = response.json()

    assert response.status_code == 200
    assert data["email"] == "test@example.com"

def test_user_update_null():
    response = client.patch(
        "/users/1",
        json={
            "user_name": None
        }
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][-1] == "user_name"

def test_user_update_empty():
    response = client.patch(
        "/users/1",
        json={}
    )

    assert response.status_code == 400

def test_user_update_not_found():
    response = client.patch(
        "/users/999",
        json={
            "user_name": "test_username"
        }
    )

    assert response.status_code == 404

def test_delete_user():
    response = client.delete("/users/1")
    data = response.json()

    assert response.status_code == 200
    assert data["message"] == "User deleted"

    response = client.get("/users/1")
    assert response.status_code == 404

def test_delete_not_found():
    response = client.delete("/users/999")
    assert response.status_code == 404