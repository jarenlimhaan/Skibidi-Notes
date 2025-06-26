import uuid
from datetime import datetime
from sqlalchemy import Column, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from src.db.base import Base


class Uploads(Base):
    __tablename__ = "uploads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    file_path = Column(Text, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Generations(Base):
    __tablename__ = "generations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    uploaded_file_path = Column(UUID(as_uuid=True), ForeignKey("uploads.id"), nullable=False)
    file_path = Column(Text, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

