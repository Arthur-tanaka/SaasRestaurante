from app.core.database import Base, engine
from app.models.order.order import Order
from app.models.order.table import Table

Base.metadata.create_all(engine)