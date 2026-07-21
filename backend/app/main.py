from fastapi import FastAPI
from app.api.orders_api.orders import router

from app.models.order.order import Order
from app.models.order.table import Table
from app.models.product.product import Product
from app.models.order_item.order_item import OrderItem
from app.models.order_history.order_item_history import OrderItemHistory

app = FastAPI()
app.include_router(router)


@app.get("/")
async def root():
    return {"message": "Hello World"}