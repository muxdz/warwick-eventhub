import os
from pydantic_settings import BaseSettings, SettingsConfigDict

env_file = os.getenv("ENV_FILE", ".env")

class Settings(BaseSettings):
    db_host: str
    db_port: int
    db_name: str
    db_user: str
    db_password: str

    model_config = SettingsConfigDict(
        env_file =env_file,
        extra="ignore"
    )

settings = Settings()