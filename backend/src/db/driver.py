# External Imports
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Internal Imports
from config.env import get_app_configs

engine = create_async_engine(
    get_app_configs().DATABASE_URL,
    echo=True,
    pool_size=5,
    max_overflow=10,
)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
