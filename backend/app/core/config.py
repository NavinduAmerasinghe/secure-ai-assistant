from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Secure AI Programming Assistant"
    debug: bool = True

    secret_key: str = "change_this_in_env"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    database_url: str = "sqlite:///./secure_ai_assistant.db"

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    vector_db_path: str = "./vectorstore"

    max_file_size: int = 1048576
    upload_dir: str = "uploads"

    frontend_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()