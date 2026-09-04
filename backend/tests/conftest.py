import pytest

from app.config import settings
from app.database import get_connection
from app.main import app
from app.security import get_current_user, hash_password

if settings.db_name != "eventhub_test":
    raise RuntimeError(
        f"Tests must use eventhub_test, not {settings.db_name}"
    )

def seed_event(
    cur,
    title,
    location,
    society_id,
    created_by_user_id,
):
    cur.execute(
        """
        INSERT INTO events (
            event_title,
            event_location,
            start_time,
            end_time,
            description,
            society_id,
            created_by_user_id
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s);
        """,
        (
            title,
            location,
            "2026-10-10 10:00:00+01",
            "2026-10-10 12:00:00+01",
            "Test description",
            society_id,
            created_by_user_id
        )
    )

def seed_society(cur, society_name):
    cur.execute(
        """
        INSERT INTO societies (society_name)
        VALUES (%s);
        """,
        (society_name,)
    )

def seed_user(cur, user_name, email, password_hash):
    cur.execute(
        """
        INSERT INTO users (user_name, email, password_hash)
        VALUES (%s, %s, %s);
        """,
        (user_name, email, password_hash)
    )

def seed_membership(cur, user_id, society_id, role):
    cur.execute(
        """
        INSERT INTO memberships (user_id, society_id, role)
        VALUES (%s, %s, %s);
        """,
        (user_id, society_id, role)
    )

@pytest.fixture(autouse=True)
def reset_db():
    app.dependency_overrides[get_current_user] = lambda: {"user_id": "1"}

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                TRUNCATE TABLE events, societies, users 
                RESTART IDENTITY CASCADE;
                """
            )

            password_hash = hash_password("test_password")
            seed_user(cur, "Alice", "alice@example.com", password_hash)
            seed_user(cur, "Bob", "bob@example.com", password_hash)

            seed_society(cur, "Cloud Society")
            seed_society(cur, "Engineering Society")

            seed_membership(cur, 1, 1, "organiser")
            seed_membership(cur, 1, 2, "organiser")
            seed_membership(cur, 2, 1, "member")
            seed_membership(cur, 2, 2, "organiser")

            seed_event(cur, "Python", "Rootes", 1, 1)
            seed_event(cur, "AWS", "FAB", 2, 2)
            seed_event(cur, "Docker", "FAB", 1, 2)

    yield
    app.dependency_overrides.clear()
