from app.database import get_connection

def check_ready():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 1;
                """
            )
                
            return cur.fetchone()