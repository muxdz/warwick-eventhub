import psycopg
from psycopg.rows import dict_row

from app.config import settings

def get_connection():
    return psycopg.connect(
        host=settings.db_host,
        port=settings.db_port,
        dbname=settings.db_name,
        user=settings.db_user,
        password=settings.db_password,

        connect_timeout=settings.db_connect_timeout,
        sslmode=settings.db_ssl_mode,
        
        row_factory=dict_row
    )
