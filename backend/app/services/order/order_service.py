from app.repositories.order_repository.order_repository import OrderRepository
from app.models.order.order import Order
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
    