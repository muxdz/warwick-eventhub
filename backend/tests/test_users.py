from fastapi.testclient import TestClient

from app.main import app
from datetime import datetime

client = TestClient(app)

def test_create_user():
    response = client.post(
        "/users",
        json={
            "username": "test_username",
            "email": "test@example.com",
            "password": "test_password"
        }
    )
    data = response.json()

    assert response.status_code == 201
    assert data["username"] == "test_username"
    assert data["email"] == "test@example.com"

def test_create_user_missing_values():
    response = client.post(
        "/users",
        json={
            "username": "test_username"
        }
    )

    assert response.status_code == 422

def test_create_user_already_exists():
    response = client.post(
        "/users",
        json={
            "username": "Alice",
            "email": "Alice@example.com",
            "password": "test_password"
        }
    )

    assert response.status_code == 400

