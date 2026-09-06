import os
from dotenv import load_dotenv
from pydantic import model_validator
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
    environment: str = "development"

    cors_origin: str

    model_config = SettingsConfigDict(
        env_file =env_file,
        extra="ignore"
    )

    @model_validator(mode="after")
    def validate_production_secrets(self):
        weak_secrets = {
            "secret",
            "changeme",
            "development-key",
            "test",
            "password",
        }

        if self.environment == "production":
            if self.jwt_secret_key.lower() in weak_secrets:
                raise ValueError(
                    "JWT_SECRET_KEY must not use a placeholder value in production"
                )

            if len(self.jwt_secret_key) < 32:
                raise ValueError(
                    "JWT_SECRET_KEY must be at least 32 characters in production"
                )

        return self

settings = Settings()