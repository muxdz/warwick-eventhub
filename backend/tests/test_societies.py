from fastapi.testclient import TestClient

from app.main import app
from datetime import datetime

client = TestClient(app)

def test_get_all_societies():
    response = client.get("/societies")
    assert response.status_code == 200

def test_get_society_by_id():
    response = client.get("/societies/1")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == 1