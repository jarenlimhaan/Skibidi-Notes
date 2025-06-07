from typing import AsyncGenerator

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.driver import engine, SessionLocal

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
