# External Imports
from typing import AsyncGenerator
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

# Internal Imports
from .driver import engine, SessionLocal


# DB Dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    try:
        async with SessionLocal() as session:
            yield session
    except SQLAlchemyError as e:
        print(f"Database session error: {e}")
        raise


# Optional shutdown event usage
async def close_db():
    if engine:
        await engine.dispose()
        print("Database connection closed")
