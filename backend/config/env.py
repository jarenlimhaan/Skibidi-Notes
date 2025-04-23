from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    
    # Frontend 
    frontend_url: str
    
    # Backend 
    backend_url: str
    database_url: str
    open_ai_api_key: str

    # Config for loading environment variables
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8")


def get_settings() -> Settings:
    return Settings()