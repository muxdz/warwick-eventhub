from fastapi.testclient import TestClient

from app.main import app
from app.security import get_current_user


client = TestClient(app)


def use_user(user_id: int):
    app.dependency_overrides[get_current_user] = lambda: {"user_id": str(user_id)}


def test_create_and_list_bookmark():
    response = client.post("/bookmarks/1")
    assert response.status_code == 201
    assert response.json() == {"user_id": 1, "event_id": 1}

    response = client.get("/bookmarks")
    assert response.status_code == 200
    assert [event["id"] for event in response.json()] == [1]


def test_cannot_create_duplicate_bookmark():
    assert client.post("/bookmarks/1").status_code == 201

    response = client.post("/bookmarks/1")
    assert response.status_code == 409
    assert response.json()["detail"] == "Event already bookmarked"


def test_cannot_bookmark_missing_event():
    response = client.post("/bookmarks/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Event not found"


def test_delete_bookmark():
    client.post("/bookmarks/1")

    response = client.delete("/bookmarks/1")
    assert response.status_code == 200
    assert response.json() == {"message": "Bookmark deleted"}
    assert client.get("/bookmarks").json() == []


def test_bookmarks_are_private_to_each_user():
    client.post("/bookmarks/1")

    use_user(2)
    assert client.get("/bookmarks").json() == []
    assert client.delete("/bookmarks/1").status_code == 404


def test_delete_missing_bookmark():
    response = client.delete("/bookmarks/1")
    assert response.status_code == 404
    assert response.json()["detail"] == "Bookmark not found"
