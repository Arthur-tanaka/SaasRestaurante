from datetime import datetime
import uuid
import app.core.database
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Numeric, Boolean, DateTime, ForeignKey, Integer, Index

class Order(app.core.database.Base):
    __tablename__ = "order"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    table_id = Column(UUID(as_uuid=True), ForeignKey("table.id"), nullable=False)
    status = Column(String, nullable=False, default="open")
    people_count = Column(Integer, nullable=True)
    total_amount = Column(Numeric(10, 2), nullable=True)
    opened_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)
    
    __table_args__ = (
        Index(
            "one_open_order_per_table",
            table_id,
            unique=True,
            postgresql_where=(status == "open"),
        ),
    )
    