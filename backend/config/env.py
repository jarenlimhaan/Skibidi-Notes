from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    
    # Frontend 
    NEXT_PUBLIC_FRONTEND_URL: str
    
    # Backend
    NEXT_PUBLIC_BACKEND_URL: str
    database_url: str
    open_ai_api_key: str

    # Config for loading environment variables
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8")


def get_settings() -> Settings:
    return Settings()