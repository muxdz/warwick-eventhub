from fastapi.testclient import TestClient
from pydantic import ValidationError
import pytest

from app.main import app
from app.config import Settings

client = TestClient(app)

def test_production_rejects_weak_jwt_secret():
    with pytest.raises(
        ValidationError,
        match="JWT_SECRET_KEY must not use a placeholder value in production",
    ):
        Settings(
            _env_file=".env.test",
            environment="production",
            jwt_secret_key="secret",
        )

def test_production_accepts_strong_jwt_secret():
    settings = Settings(
        _env_file=".env.test",
        environment="production",
        jwt_secret_key="a-very-long-random-production-secret-key-123456789",
    )

    assert settings.environment == "production"