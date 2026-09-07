import pytest

from fastapi.testclient import TestClient

from app.main import app
from app.security import get_current_user

client = TestClient(app)

def test_get_user_by_id():
    response = client.get("/users/1")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == 1
    assert "password_hash" not in data
    assert "password" not in data

def test_get_user_by_id_not_found():
    response = client.get("/users/999")

    data = response.json()

    assert response.status_code == 404
    assert data["detail"] == "User not found"
    assert "password_hash" not in data
    assert "password" not in data


def test_create_user():
    response = client.post(
        "/auth/register",
        json={
            "user_name": "test_username",
            "email": "test@example.com",
            "password": "Test_password!"
        }
    )
    data = response.json()

    assert response.status_code == 201
    assert data["user_name"] == "test_username"
    assert data["email"] == "test@example.com"
    assert "password" not in data
    assert "password_hash" not in data

def test_create_user_missing_values():
    response = client.post(
        "/auth/register",
        json={
            "user_name": "test_username"
        }
    )

    assert response.status_code == 422

def test_create_user_already_exists():
    response = client.post(
        "/auth/register",
        json={
            "user_name": "Alice",
            "email": "alice@example.com",
            "password": "Test_password!"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "User already exists"

def test_login_user():
    response = client.post(
        "/auth/login",
        data={
            "username": "alice@example.com",
            "password": "test_password"
        }
    )

    data = response.json()

    assert response.status_code == 200
    assert data["access_token"]
    assert data["token_type"] == "bearer"
    assert "password_hash" not in response.json()
    assert "password" not in response.json()

def test_login_user_incorrect_credentials():
    response = client.post(
        "/auth/login",
        data={
            "username": "alice@example.com",
            "password": "wrong_password"
        }    
    )

    assert response.status_code == 401
    assert "password_hash" not in response.json()
    assert "password" not in response.json()

def test_update_user_unauthorized():
    app.dependency_overrides.pop(get_current_user, None)

    response = client.patch(
        "/users/me",
        json={
            "user_name": "new_username"
        }
    )

    assert response.status_code == 401 
    assert response.json()["detail"] == "Not authenticated"

def test_update_user_authorized():
    app.dependency_overrides.pop(get_current_user, None)

    # First, log in to get the access token
    login_response = client.post(
        "/auth/login",
        data={
            "username": "alice@example.com",
            "password": "test_password"
        }    
    )

    token = login_response.json()["access_token"]

    response = client.patch(
        "/users/me",
        json={
            "user_name": "new_username"
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    data = response.json()

    assert response.status_code == 200
    assert data["user_name"] == "new_username"

def test_update_user_password():
    app.dependency_overrides.pop(get_current_user, None)

    # First, log in to get the access token
    login_response = client.post(
        "/auth/login",
        data={
            "username": "alice@example.com",
            "password": "test_password"
        }
    )

    token = login_response.json()["access_token"]

    response = client.patch(
        "/users/me/password",
        json={
            "old_password": "test_password",
            "new_password": "New_test_password!"
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

def test_update_user_password_incorrect_old_password():
    app.dependency_overrides.pop(get_current_user, None)

    # First, log in to get the access token
    login_response = client.post(
        "/auth/login",
        data={
            "username": "alice@example.com",
            "password": "test_password"
        }
    )

    token = login_response.json()["access_token"]

    response = client.patch(
        "/users/me/password",
        json={
            "old_password": "wrong_password",
            "new_password": "New_test_password!"
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 401

def test_delete_user():
    app.dependency_overrides.pop(get_current_user, None)

    # First, log in to get the access token
    login_response = client.post(
        "/auth/login",
        data={
            "username": "alice@example.com",
            "password": "test_password"
        }
    )

    token = login_response.json()["access_token"]

    response = client.delete(
        "/users/me",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

def test_delete_user_unauthorized():
    app.dependency_overrides.pop(get_current_user, None)

    response = client.delete("/users/me")

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


@pytest.mark.parametrize("password,reason", [
    ("Short!", "at least 10 characters"),
    ("lowercase!", "uppercase letter"),
    ("UPPERCASE!", "lowercase letter"),
    ("NoSymbols1", "one symbol"),
])
def test_authenticated_user_cannot_change_to_weak_password(password, reason):
    app.dependency_overrides.pop(get_current_user, None)
    credentials = {"username": "alice@example.com", "password": "test_password"}
    login_response = client.post("/auth/login", data=credentials)
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    response = client.patch(
        "/users/me/password",
        json={"old_password": "test_password", "new_password": password},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 422
    errors = response.json()["detail"]
    assert any(error["loc"] == ["body", "new_password"] and reason in error["msg"] for error in errors)
    # A rejected change must leave the original credentials working.
    assert client.post("/auth/login", data=credentials).status_code == 200
    assert client.post("/auth/login", data={**credentials, "password": password}).status_code == 401
