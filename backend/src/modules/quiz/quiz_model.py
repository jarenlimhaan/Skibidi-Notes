# External Imports
import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB

# Internal Imports
from src.db.base import Base


class Quiz(Base):
    __tablename__ = "quiz"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id = Column(UUID(as_uuid=True), ForeignKey("uploads.id"), nullable=False)

    content = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
