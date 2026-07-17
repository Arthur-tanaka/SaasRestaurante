from app.core.database import Base, engine, SessionLocal
from app.models.order.order import Order
from app.models.order.table import Table
from app.models.product.product import Product
from app.models.order_item.order_item import OrderItem
from app.models.order_history.order_item_history import OrderItemHistory
from app.repositories.order_repository.order_repository import OrderRepository
from app.services.order.order_service import OrderService, AddItems
from app.services.order_item.order_item_service import OrderItemService
import uuid

# Cria todas as tabelas que ainda não existem
Base.metadata.create_all(engine)

db = SessionLocal()

# Cria um produto de teste
product = Product(id=uuid.uuid4(), name="Coxinha", price=10.50, active=True)
db.add(product)
db.commit()
db.refresh(product)
print(f"Produto criado: {product.id}")

# Pega uma mesa já existente no banco
table = db.query(Table).first()
if table is None:
    raise Exception("Nenhuma mesa encontrada - crie uma mesa antes de testar")
print(f"Mesa usada: {table.id}")

# Abre um pedido (se a mesa já tiver pedido aberto, isso vai falhar - use outra mesa/limpe o banco)
order_repo = OrderRepository(db)
order_service = OrderService(order_repo)
order = order_service.open_order(table.id)
print(f"Pedido aberto: {order.id}")

# Adiciona itens ao pedido
order_item_service = OrderItemService(db)
add_items = AddItems(order_service, order_item_service)

items_data = [{"product_id": product.id, "quantity": 2}]
result = add_items.execute(order.id, items_data, uuid.uuid4())
print(f"Itens criados: {result}")