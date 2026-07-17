from sqlalchemy import UUID

from sqlalchemy import Column, String, Numeric, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.core.database import Base 


class Product(Base):
    __tablename__ = "product"

    id = Column(UUID(as_uuid=True), 
                primary_key=True, 
                default=uuid.uuid4)
    
    name = Column(String, 
        nullable=False)
    
    price = Column(Numeric(10, 2),
        nullable=False)
    
    active = Column(Boolean, nullable=False, 
        default=True)
    
    
    crated_at = Column(DateTime, nullable=False, 
        default=datetime.utcnow)
