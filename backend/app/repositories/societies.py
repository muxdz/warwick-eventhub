from app.database import get_connection

def get_societies():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM societies;
                """
            )
                
            return cur.fetchall()

def get_society_by_id(society_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM societies
                WHERE id = %s;
                """,
                (society_id,)
            )

            return cur.fetchone()

def get_society_by_name(society_name: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM societies
                WHERE society_name = %s;
                """,
                (society_name,)
            )

            return cur.fetchone()

def create_society(society_data):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO societies (
                    society_name
                )
                VALUES (%s)
                RETURNING 
                    id,
                    society_name;
                """,
                (
                    society_data.society_name,
                )
            )

            return cur.fetchone()

def delete_society(society_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM societies
                WHERE id = %s
                RETURNING id;
                """,
                (society_id,)
            )

            return cur.fetchone()

def update_society(society_id: int, society_updates):
    update_parts = [f"{field} = %s" for field in society_updates]
    update_clause = ", ".join(update_parts)
        
    values = list(society_updates.values())
    values.append(society_id)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                UPDATE societies
                SET {update_clause}
                WHERE id = %s
                RETURNING *;
                """,
                (values)
            )
        
            return cur.fetchone()