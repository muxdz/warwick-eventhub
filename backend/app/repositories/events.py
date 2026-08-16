from app.database import get_connection

def get_events():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    id,
                    event_title,
                    event_location,
                    start_time,
                    end_time,
                    description,
                    society_id,
                    created_by_user_id
                FROM events
                ORDER BY start_time;
                """
            )
                
            return cur.fetchall()