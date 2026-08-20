from app.database import get_connection

def create_user(user_data, password_hash):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (user_name, email, password_hash)
                VALUES (%s, %s, %s)
                RETURNING 
                    id,
                    user_name,
                    email,
                    created_at;
                """,
                (
                    user_data.user_name, 
                    user_data.email, 
                    password_hash
                )
            )

            return cur.fetchone()