import asyncio
import json

import pytest

from app.rate_limit import AuthRateLimitMiddleware


@pytest.fixture(autouse=True)
def reset_db():
    """These middleware tests do not access the database."""
    yield


@pytest.fixture
def limiter():
    now = [0.0]

    async def endpoint(scope, receive, send):
        await send({"type": "http.response.start", "status": 401, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    return AuthRateLimitMiddleware(endpoint, clock=lambda: now[0]), now


def request(limiter, path="/auth/login", ip="192.0.2.1", method="POST", headers=None):
    messages = []

    async def receive():
        return {"type": "http.request", "body": b""}

    async def send(message):
        messages.append(message)

    asyncio.run(limiter({
        "type": "http", "method": method, "path": path,
        "client": (ip, 1234), "headers": headers or [],
    }, receive, send))
    return messages


@pytest.mark.parametrize("path", ["/auth/login", "/auth/register"])
def test_eleventh_attempt_is_rejected(limiter, path):
    middleware, _ = limiter
    for _ in range(10):
        assert request(middleware, path)[0]["status"] == 401
    response = request(middleware, path)
    assert response[0]["status"] == 429
    assert dict(response[0]["headers"])[b"retry-after"] == b"60"
    assert "try again in 60 seconds" in json.loads(response[1]["body"])["detail"]


def test_ips_and_endpoints_have_separate_limits(limiter):
    middleware, _ = limiter
    for _ in range(10):
        request(middleware)
    assert request(middleware, ip="192.0.2.2")[0]["status"] == 401
    assert request(middleware, path="/auth/register")[0]["status"] == 401
    assert request(middleware, path="/users/me")[0]["status"] == 401
    assert request(middleware, method="OPTIONS")[0]["status"] == 401


def test_window_expires_without_rejected_attempts_extending_it(limiter):
    middleware, now = limiter
    for _ in range(10):
        request(middleware)
    now[0] = 59.1
    response = request(middleware)
    assert response[0]["status"] == 429
    assert dict(response[0]["headers"])[b"retry-after"] == b"1"
    now[0] = 60
    assert request(middleware)[0]["status"] == 401


def test_rolling_window(limiter):
    middleware, now = limiter
    request(middleware)
    now[0] = 30
    for _ in range(9):
        request(middleware)
    now[0] = 60
    assert request(middleware)[0]["status"] == 401
    assert request(middleware)[0]["status"] == 429


def test_trailing_slash_and_spoofed_headers_cannot_bypass_limit(limiter):
    middleware, _ = limiter
    for _ in range(10):
        request(middleware)
    assert request(middleware, path="/auth/login/")[0]["status"] == 429
    assert request(middleware, headers=[(b"x-forwarded-for", b"192.0.2.99")])[0]["status"] == 429


def test_expired_ips_are_removed(limiter):
    middleware, now = limiter
    request(middleware)
    now[0] = 60
    request(middleware, ip="192.0.2.2")
    assert ("192.0.2.1", "/auth/login") not in middleware.attempts
