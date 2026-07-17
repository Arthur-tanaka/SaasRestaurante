from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session
from app.repositories.product_repository.product_repository import ProductRepository
from app.models.order_item_repository.order_item_repository import OrderItemRepository
from app.models.order_item.order_item import OrderItem
from app.models.order_history.order_item_history import OrderItemHistory
from app.repositories.order_item_history_repository.order_item_history_repository import OrderItemHistoryRepository
from app.models.product.product import Product


class ItemNotFoundException(Exception):
    pass


class ItemAlreadyDeliveredException(Exception):
    pass


class InvalidCancelQuantityException(Exception):
    pass


class ProductNotFoundException(Exception):
    pass


class OrderItemService:
    def __init__(self, db: Session):
        self.db = db
        self.order_item_repo =  OrderItemRepository(db)
        self.history_repo = OrderItemHistoryRepository(db)
        self.product_repo = ProductRepository(db)

    def add_items(self, order_id: UUID, items_data: list[dict], created_by: UUID) -> list[OrderItem]:
        
        items = []
        for item_data in items_data:
            product = self.product_repo.get_by_id(item_data['product_id'])
            if product is None:
                raise ProductNotFoundException(f"Produto {item_data['product_id']} não encontrado")

            order_item = OrderItem(
                order_id=order_id,
                product_id=product.id,
                quantity=item_data['quantity'],
                unit_price=product.price,
                status='pending',
            )
            items.append(order_item)

        saved_items = self.order_item_repo.create_bulk(items)

        for item in saved_items:
            history = OrderItemHistory(
                order_item_id=item.id,
                previous_status=None,
                new_status='pending',
                changed_by=created_by,
                reason=None,
                changed_at=datetime.utcnow(),
            )
            self.history_repo.create(history)

        return saved_items

    def cancel_item(
        self,
        item_id: UUID,
        reason: str,
        cancelled_by: UUID,
        quantity_to_cancel: int,
    ) -> OrderItem:
        item = self.order_item_repo.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundException(f"Item {item_id} não encontrado")

        if item.status == 'delivered':
            raise ItemAlreadyDeliveredException(
                f"Item {item_id} já foi entregue e não pode ser cancelado"
            )

        remaining = item.quantity - item.cancelled_quantity
        if quantity_to_cancel <= 0 or quantity_to_cancel > remaining:
            raise InvalidCancelQuantityException(
                f"Quantidade inválida: restam {remaining} unidades cancelláveis"
            )

        previous_status = item.status
        item.cancelled_quantity += quantity_to_cancel

        if item.cancelled_quantity == item.quantity:
            item.status = 'cancelled'

        history = OrderItemHistory(
            order_item_id=item.id,
            previous_status=previous_status,
            new_status=item.status,
            changed_by=cancelled_by,
            reason=reason,
            changed_at=datetime.utcnow(),
        )
        self.history_repo.create(history)

        self.db.commit()
        self.db.refresh(item)

        return item

    def get_item_history(self, item_id: UUID) -> list[OrderItemHistory]:
        item = self.order_item_repo.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundException(f"Item {item_id} não encontrado")

        return self.history_repo.get_by_item_id(item_id)

    def update_item_status(self, item_id: UUID, new_status: str, changed_by: UUID, reason: str = None) -> OrderItem:
        item = self.order_item_repo.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundException(f"Item {item_id} não encontrado")

        previous_status = item.status
        item.status = new_status
        item.updated_at = datetime.utcnow()

        history = OrderItemHistory(
            order_item_id=item.id,
            previous_status=previous_status,
            new_status=new_status,
            changed_by=changed_by,
            reason=reason,
            changed_at=datetime.utcnow(),
        )
        self.history_repo.create(history)

        self.db.commit()
        self.db.refresh(item)

        return item

    def get_items_by_order(self, order_id: UUID) -> list[OrderItem]:
        
        return self.order_item_repo.get_by_order_id(order_id)

    def get_item_by_id(self, item_id: UUID) -> OrderItem:
        item = self.order_item_repo.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundException(f"Item {item_id} não encontrado")
        return item

    def update_quantity(self, item_id: UUID, new_quantity: int, changed_by: UUID, reason: str = None) -> OrderItem: 
        item = self.order_item_repo.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundException(f"Item {item_id} não encontrado")

        if item.status == 'delivered':
            raise ItemAlreadyDeliveredException(
                f"Item {item_id} já foi entregue e não pode ser alterado"
            )

        if new_quantity <= 0:
            raise InvalidCancelQuantityException("Quantidade deve ser maior que zero")

        previous_status = item.status
        item.quantity = new_quantity
        item.updated_at = datetime.utcnow()

        if item.cancelled_quantity > item.quantity:
            item.cancelled_quantity = item.quantity

        history = OrderItemHistory(
            order_item_id=item.id,
            previous_status=previous_status,
            new_status=item.status,
            changed_by=changed_by,
            reason=f"Quantidade alterada para {new_quantity}" + (f": {reason}" if reason else ""),
            changed_at=datetime.utcnow(),
        )
        self.history_repo.create(history)

        self.db.commit()
        self.db.refresh(item)

        return item

    def get_cancellable_quantity(self, item_id: UUID) -> int:
        item = self.order_item_repo.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundException(f"Item {item_id} não encontrado")
        
        if item.status == 'delivered':
            return 0
        
        return item.quantity - item.cancelled_quantity

    def bulk_update_status(self, item_ids: list[UUID], new_status: str, changed_by: UUID, reason: str = None) -> list[OrderItem]:
        
        updated_items = []
        for item_id in item_ids:
            try:
                item = self.update_item_status(item_id, new_status, changed_by, reason)
                updated_items.append(item)
            except ItemNotFoundException as e:
                
                continue
        
        return updated_items