import pytest

from app.config import settings
from app.database import get_connection

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

def seed_user(cur, user_name, email):
    cur.execute(
        """
        INSERT INTO users (user_name, email, password_hash)
        VALUES (%s, %s, 'test_hash');
        """,
        (user_name, email)
    )

@pytest.fixture(autouse=True)
def reset_db():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                TRUNCATE TABLE events, societies, users 
                RESTART IDENTITY CASCADE;
                """
            )

            seed_user(cur, "Alice", "alice@example.com")
            seed_user(cur, "Bob", "bob@example.com")

            seed_society(cur, "Cloud Society")
            seed_society(cur, "Engineering Society")

            seed_event(cur, "Python", "Rootes", 1, 1)
            seed_event(cur, "AWS", "FAB", 2, 2)
            seed_event(cur, "Docker", "FAB", 1, 2)