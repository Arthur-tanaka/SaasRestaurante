from datetime import datetime
import uuid
import app.core.database
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Numeric, Boolean, DateTime, ForeignKey, Integer, Index

class Table(app.core.database.Base):
    __tablename__ = "table"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    number = Column(Integer, nullable=False, unique=True)
    status = Column(String, nullable=False, default="free")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    