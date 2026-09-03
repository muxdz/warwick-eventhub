from app.database import get_connection

def get_all_users():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    id,
                    user_name,
                    email,
                    created_at
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
                    id,
                    user_name,
                    email,
                    created_at
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
                    email,
                    password_hash,
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

def delete_user(user_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM users
                WHERE id = %s
                RETURNING id;
                """,
                (user_id,)
            )

            return cur.fetchone()

def update_user(user_id: int, user_updates):
    update_parts = [f"{field} = %s" for field in user_updates]
    update_clause = ", ".join(update_parts)
    
    values = list(user_updates.values())
    values.append(user_id)

    with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    UPDATE users
                    SET {update_clause}
                    WHERE id = %s
                    RETURNING *;
                    """,
                    (
                        values
                    )
                )
    
                return cur.fetchone()