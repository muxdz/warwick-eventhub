import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

env_file = os.getenv("ENV_FILE", ".env")
load_dotenv(env_file, override=True)

class Settings(BaseSettings):
    db_host: str
    db_port: int
    db_name: str
    db_user: str
    db_password: str

    db_connect_timeout: int
    db_ssl_mode: str

    jwt_secret_key: str
    jwt_expire_minutes: int

    cors_origin: str

    model_config = SettingsConfigDict(
        env_file =env_file,
        extra="ignore"
    )

settings = Settings()