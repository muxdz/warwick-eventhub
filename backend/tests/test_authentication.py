"""Security regression tests using the real bearer authentication dependency."""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.security import get_current_user


@pytest.fixture
def unauthenticated_client(reset_db):
    # reset_db normally authenticates every request as Alice. Explicitly depend
    # on it so this removal happens after seeding, before any security request.
    override = app.dependency_overrides.pop(get_current_user)
    try:
        with TestClient(app) as client:
            yield client
    finally:
        app.dependency_overrides[get_current_user] = override


PROTECTED_MUTATIONS = [
    pytest.param("POST", "/events", {
        "event_title": "Security test event",
        "event_location": "Rootes",
        "start_time": "2026-10-10T10:00:00+01:00",
        "society_id": 1,
    }, id="create-event"),
    pytest.param("PATCH", "/events/1", {"event_title": "Changed"}, id="update-event"),
    pytest.param("DELETE", "/events/1", None, id="delete-event"),
    pytest.param("POST", "/bookmarks/1", None, id="create-bookmark"),
    pytest.param("DELETE", "/bookmarks/1", None, id="delete-bookmark"),
    pytest.param("POST", "/societies", {"society_name": "Security test society"}, id="create-society"),
    pytest.param("PATCH", "/societies/1", {"society_name": "Changed"}, id="update-society"),
    pytest.param("DELETE", "/societies/1", None, id="delete-society"),
    pytest.param("POST", "/societies/1/members/2", None, id="add-member"),
    pytest.param("PATCH", "/societies/1/members/2?role=organiser", None, id="update-member"),
    pytest.param("DELETE", "/societies/1/members/2", None, id="remove-member"),
    pytest.param("PATCH", "/users/me", {"user_name": "Changed"}, id="update-profile"),
    pytest.param("PATCH", "/users/me/password", {
        "old_password": "test_password",
        "new_password": "NewPassword!",
    }, id="change-password"),
    pytest.param("DELETE", "/users/me", None, id="delete-account"),
]


@pytest.mark.parametrize("method,path,body", PROTECTED_MUTATIONS)
@pytest.mark.parametrize("headers,detail", [
    pytest.param({}, "Not authenticated", id="missing-authentication"),
    pytest.param({"Authorization": "Bearer garbage"}, "Could not validate credentials", id="invalid-token"),
])
def test_protected_mutations_require_real_authentication(
    unauthenticated_client, method, path, body, headers, detail,
):
    # Valid payloads and seeded IDs ensure these exercise authentication rather
    # than accidentally passing through request validation or missing resources.
    response = unauthenticated_client.request(method, path, json=body, headers=headers)

    assert response.status_code == 401
    assert response.json()["detail"] == detail
    assert response.headers["www-authenticate"] == "Bearer"
