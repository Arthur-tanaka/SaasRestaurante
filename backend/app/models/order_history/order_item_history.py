from sqlalchemy import Column, Integer, Numeric, String, ForeignKey, CheckConstraint, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
import app.core.database

class OrderItemHistory(app.core.database.Base):
    __tablename__ = "order_item_history"
    
    id = Column(UUID(as_uuid=True),
                primary_key=True,
                default=uuid.uuid4)
    
    order_item_id = Column(UUID(as_uuid=True),
                           ForeignKey("order_items.id"),
                           ondelete="CASCADE", nullable=False)
    
    private_status = Column(String(50), 
                            nullable=True)
    
    new_status = Column(String(50),
                        nullable=False)
    
    changed_key = Column(UUID(as_uuid=True),
                         ForeignKey("users.id", ondelete="RESTRICT"),
                         nullable=False)
    
    reason = Column(Text,
                    nullable=True)
    
    changed_at = Column(DateTime, nullable=False, 
                        default=datetime.utcnow)

    order_item = relationship("OrderItem", 
                              back_populates="history")
    
    user = relationship("User", 
                        back_populares="order_item_histories")

    def __repr__(self):
        return f"<OrderItemHistory {self.id} - {self.order_item_id} - {self.new_status}>"
