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

def create_event(event_data):   
    with get_connection() as conn:
        with conn.cursor() as cur:
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
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING 
                    id,
                    event_title,
                    event_location,
                    start_time, 
                    end_time,
                    description,
                    society_id,
                    created_by_user_id;
                """,
                (
                    event_data.title,
                    event_data.society,
                    event_data.location,
                    event_data.start_time,
                    event_data.end_time
                )
            )

            return cur.fetchone()

        