from app.database import get_connection

def get_all_users():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM users;
                """
            )
                
            return cur.fetchall()

def get_user_by_id(user_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM users
                WHERE id = %s;
                """,
                (user_id,)
            )

            return cur.fetchone()

def get_user_by_email(email: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM users
                WHERE email = %s;
                """,
                (email,)
            )

            return cur.fetchone()


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