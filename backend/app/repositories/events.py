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
                    event_data.event_title,
                    event_data.event_location,
                    event_data.start_time,
                    event_data.end_time,
                    event_data.description,
                    event_data.society_id,
                    event_data.created_by_user_id
                )
            )

            return cur.fetchone()

def delete_event(event_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM events
                WHERE id = %s
                RETURNING id;
                """,
                (event_id,)
            )

            return cur.fetchone()

def update_event(event_id: int, event_updates):

    update_parts = [f"{field} = %s" for field in event_updates]
    update_clause = ", ".join(update_parts)

    values = list(event_updates.values())
    values.append(event_id)
  

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                UPDATE events
                SET {update_clause}
                WHERE id = %s
                RETURNING *;
                """,
                (
                    values
                )
            )

            return cur.fetchone()