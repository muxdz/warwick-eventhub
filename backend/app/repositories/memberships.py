from app.database import get_connection

def get_all_memberships():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM memberships;
                """
            )
                
            return cur.fetchall()

def get_user_memberships(user_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    *
                FROM memberships
                WHERE user_id = %s;
                """,
                (user_id,)
            )

            return cur.fetchall()

def get_society_members(society_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    *
                FROM memberships
                WHERE society_id = %s;
                """,
                (society_id,)
            )

            return cur.fetchall()

def get_membership(society_id, user_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    *
                FROM memberships
                WHERE society_id = %s AND user_id = %s;
                """,
                (society_id, user_id)
            )

            return cur.fetchone()

def insert_membership(society_id, user_id, role):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO memberships (user_id, society_id, role)
                VALUES (%s, %s, %s)
                RETURNING *;
                """,
                (user_id, society_id, role)
            )

            return cur.fetchone()

def update_membership(society_id, user_id, role):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE memberships
                SET role = %s
                WHERE society_id = %s AND user_id = %s
                RETURNING *;
                """,
                (role, society_id, user_id)
            )

            return cur.fetchone()

def delete_membership(society_id, user_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM memberships
                WHERE society_id = %s AND user_id = %s
                RETURNING *;
                """,
                (society_id, user_id)
            )

            return cur.fetchone()
