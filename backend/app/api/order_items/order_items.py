from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.item_schemas import (
    AddItemsRequest,
    CancelItemRequest,
    OrderItemResponse,
    OrderItemHistoryResponse,
)
from app.services.order_item.order_item_service import (
    OrderItemService,
    ItemNotFoundException,
    ItemAlreadyDeliveredException,
    InvalidCancelQuantityException,
    ProductNotFoundException,
    InvalidStatusTransitionException,
)

router = APIRouter(tags=["order-items"])


def get_order_item_service(db: Session = Depends(get_db)) -> OrderItemService:
    return OrderItemService(db)


@router.post(
    "/orders/{order_id}/items",
    response_model=List[OrderItemResponse],
    status_code=status.HTTP_201_CREATED,
)
def add_items(
    order_id: UUID,
    payload: AddItemsRequest,
    service: OrderItemService = Depends(get_order_item_service),
):
    try:
        items_data = [item.model_dump() for item in payload.items]
        return service.add_items(
            order_id=order_id,
            items_data=items_data,
            created_by=payload.created_by,
        )
    except ProductNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/order-items/cancel", response_model=OrderItemResponse)
def cancel_item(
    payload: CancelItemRequest,
    cancelled_by: UUID,
    service: OrderItemService = Depends(get_order_item_service),
):
    try:
        return service.cancel_item(
            item_id=payload.item_id,
            reason=payload.reason,
            cancelled_by=cancelled_by,
            quantity_to_cancel=payload.quantity_to_cancel,
        )
    except ItemNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ItemAlreadyDeliveredException as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except InvalidCancelQuantityException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/orders/{order_id}/items", response_model=List[OrderItemResponse])
def get_items_by_order(
    order_id: UUID,
    service: OrderItemService = Depends(get_order_item_service),
):
    return service.get_items_by_order(order_id)


@router.get("/order-items/{item_id}/history", response_model=List[OrderItemHistoryResponse])
def get_item_history(
    item_id: UUID,
    service: OrderItemService = Depends(get_order_item_service),
):
    try:
        return service.get_item_history(item_id)
    except ItemNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))