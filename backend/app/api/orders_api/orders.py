from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.order_repository.order_repository import OrderRepository
from app.services.order.order_service import OrderService, OpenOrder
from app.schemas.order_schemas.order_schemas import OrderCreate
from app.services.order.order_service import OrderService, OpenOrder, TableAlreadyOccupiedError

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/")
def open_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    order_repository = OrderRepository(db)
    order_service = OrderService(order_repository)
    open_order_use_case = OpenOrder(order_service)
    try:
        return open_order_use_case.execute(order_data.table_id)
    except TableAlreadyOccupiedError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.get("/{order_id}")
def get_order(order_id: UUID, db: Session = Depends(get_db)):
    order_repository = OrderRepository(db)
    order_service = OrderService(order_repository)
    order = order_service.get_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")
    return order