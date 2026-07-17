from app.repositories.order_repository.order_repository import OrderRepository
from app.models.order.order import Order
from app.services.order_item.order_item_service import OrderItemService
from app.models.order_item.order_item import OrderItem
from uuid import UUID


class TableAlreadyOccupiedError(Exception):
    pass

class OrderService:
    def __init__(self, order_repository: OrderRepository):
        self.order_repository = order_repository
    
    def open_order(self, table_id: UUID) -> Order:
        existing_order = self.order_repository.get_open_order_by_table(table_id)
        
        if existing_order:
            raise TableAlreadyOccupiedError(f"A mesa {table_id} já possui um pedido aberto.")
        
        new_order = Order(table_id=table_id, status='open')
        return self.order_repository.create(new_order)
    
    def get_by_id(self, order_id: UUID) -> Order | None:
        return self.order_repository.get_by_id(order_id)
    
class OpenOrder:
    def __init__(self, order_service: OrderService):
        self.order_service = order_service
    
    def execute(self, table_id: UUID) -> Order:
        return self.order_service.open_order(table_id)

class AddItems:
    def __init__(self, order_service: OrderService, order_item_service: OrderItemService):
        self.order_service = order_service
        self.order_item_service = order_item_service
    
    def execute(self, order_id: UUID, items_data: list[dict], created_by: UUID) -> list[OrderItem]:
        order = self.order_service.get_by_id(order_id)
        
        if not order:
            raise ValueError(f"Pedido com ID {order_id} não encontrado.")
        
        if order.status != 'open':
            raise ValueError(f"Pedido {order_id} não está aberto.")
        
        return self.order_item_service.add_items(order_id, items_data, created_by)