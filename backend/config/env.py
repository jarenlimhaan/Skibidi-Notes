from pydantic_settings import BaseSettings, SettingsConfigDict


class App_Config(BaseSettings):

    # Frontend
    NEXT_PUBLIC_FRONTEND_URL: str

    # Backend
    NEXT_PUBLIC_BACKEND_URL: str
    DATABASE_URL: str
    DATABASE_URL_PGVECTOR: str
    OPEN_AI_API_KEY: str
    ELEVEN_LAB_API_KEY: str
    ASSEMBLY_AI_API_KEY: str
    IMAGEMAGICK_BINARY: str

    # Static file directories
    SUBTITLES_DIR: str
    OUTPUT_DIR: str
    TEMP_DIR: str
    VIDEOS_DIR: str
    UPLOAD_DIR: str
    
    # Config for loading environment variables
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8")


def get_app_configs() -> App_Config:
    return App_Config()
