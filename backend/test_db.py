from app.core.database import Base, engine
from app.models.order.order import Order
from app.models.order.table import Table
from app.models.product.product import Product
from app.models.order_item.order_item import OrderItem
from app.models.order_history.order_item_history import OrderItemHistory

Base.metadata.create_all(engine)