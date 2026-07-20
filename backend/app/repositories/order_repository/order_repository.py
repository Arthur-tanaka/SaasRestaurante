from decimal import Decimal
from sqlalchemy.orm import Session
from uuid import UUID
from app.models.order.order import Order
from datetime import datetime

class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, order_id: UUID) -> Order | None:
        return self.db.query(Order).filter(Order.id == order_id).first()

    def create(self, order: Order) -> Order:
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        return order
    
    def get_open_order_by_table(self, table_id: UUID) -> Order | None:
        return self.db.query(Order).filter(
            Order.table_id == table_id,
            Order.status == 'open'
        ).first()
        
    def close_order(self, order: Order, people_count: int, total_amount: Decimal) -> Order:
        order.status = 'closed'
        order.people_count = people_count
        order.total_amount = total_amount
        order.closed_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(order)
        return order