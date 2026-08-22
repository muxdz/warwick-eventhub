from app.database import get_connection


def get_user_bookmarks(user_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT events.*
                FROM bookmarks
                JOIN events ON events.id = bookmarks.event_id
                WHERE bookmarks.user_id = %s
                ORDER BY events.start_time;
                """,
                (user_id,)
            )

            return cur.fetchall()


def get_bookmark(user_id: int, event_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT *
                FROM bookmarks
                WHERE user_id = %s AND event_id = %s;
                """,
                (user_id, event_id)
            )

            return cur.fetchone()


def create_bookmark(user_id: int, event_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO bookmarks (user_id, event_id)
                VALUES (%s, %s)
                RETURNING *;
                """,
                (user_id, event_id)
            )

            return cur.fetchone()


def delete_bookmark(user_id: int, event_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM bookmarks
                WHERE user_id = %s AND event_id = %s
                RETURNING *;
                """,
                (user_id, event_id)
            )

            return cur.fetchone()
