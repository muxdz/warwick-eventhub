from app.database import get_connection

def get_all_events(society_id, start_after, search):
    conditions = []
    params = []

    if society_id is not None:
        conditions.append("society_id = %s")
        params.append(society_id)

    if start_after is not None:
        conditions.append("start_time > %s")
        params.append(start_after)

    if search is not None:
        conditions.append("event_title ILIKE %s OR description ILIKE %s")
        params.append(f"%{search}%")
        params.append(f"%{search}%")

    if len(conditions) > 0:
        condition_clause = " WHERE " + " AND ".join(conditions)
    else:
        condition_clause = ""

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                SELECT 
                    *
                FROM events
                {condition_clause}
                ORDER BY start_time;
                """,
                tuple(params)
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

def create_event(event_data, user_id):   
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
                    created_by_user_id,
                    image_key
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING 
                    id,
                    event_title,
                    event_location,
                    start_time, 
                    end_time,
                    description,
                    society_id,
                    created_by_user_id,
                    image_key;
                """,
                (
                    event_data.event_title,
                    event_data.event_location,
                    event_data.start_time,
                    event_data.end_time,
                    event_data.description,
                    event_data.society_id,
                    user_id,
                    event_data.image_key
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
    update_parts.append("updated_at = NOW()")
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