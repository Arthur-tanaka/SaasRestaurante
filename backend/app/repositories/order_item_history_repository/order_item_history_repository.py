from sqlalchemy.orm import Session
from uuid import UUID
from app.models.order_item_history import OrderItemHistory

class OrderItemHistoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, history_entry: OrderItemHistory) -> OrderItemHistory:
        self.db.add(history_entry)
        self.db.commit()
        self.db.refresh(history_entry)
        return history_entry

    def get_by_item_id(self, order_item_id: UUID) -> list[OrderItemHistory]:
        return self.db.query(OrderItemHistory).filter(
            OrderItemHistory.order_item_id == order_item_id
        ).all() 