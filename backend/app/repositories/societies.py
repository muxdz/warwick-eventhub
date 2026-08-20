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