from fastapi.testclient import TestClient
import psycopg

from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_ready():
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ready"}

def test_readiness_database_unavailable(monkeypatch):
    def failed_database_check():
        raise psycopg.OperationalError("Database unavailable")

    monkeypatch.setattr(
        "app.main.check_ready",
        failed_database_check,
    )

    response = client.get("/ready")

    assert response.status_code == 503
    assert response.json() == {"detail": "Database unavailable"}