from app.database import get_connection

def get_all_events():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM events
                ORDER BY start_time;
                """
            )
                
            return cur.fetchall()

def get_event_by_id(event_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM events
                WHERE id = %s;
                """,
                (event_id,)
            )

            return cur.fetchone()