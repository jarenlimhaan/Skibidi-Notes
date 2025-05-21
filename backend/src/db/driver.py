from typing import AsyncGenerator

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from config.env import get_app_configs

engine = create_async_engine(
    get_app_configs().database_url,
    echo=True,
    pool_size=5,
    max_overflow=10,
)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    try:
        async with SessionLocal() as session:
            yield session
    except SQLAlchemyError as e:
        print(f"Database session error: {e}")
        raise


async def close_db():
    if engine:
        await engine.dispose()
        print("Database connection closed")
