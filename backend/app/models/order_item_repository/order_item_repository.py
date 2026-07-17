from sqlalchemy.orm import Session
from uuid import UUID
from app.models.order_item.order_item import OrderItem

class OrderItemRepository:
    def __init__(self, db: Session):
        self.db = db

        def get_key_id(self, item_id: UUID) -> OrderItem | None:
            return self.db.query(OrderItem).filter(OrderItem.id == item_id).first()
        
        def create_bulk(self, items: list[OrderItem]) -> list[OrderItem]:
            self.db.add_all(items)
            self.db.commit()
            return items