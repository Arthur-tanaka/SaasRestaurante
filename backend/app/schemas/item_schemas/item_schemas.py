from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from enum import Enum


class ItemStatus(str, Enum):
    """Status possíveis para um item do pedido"""

    PENDING = "pending"
    PREPARING = "preparing"
    READY = "ready"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class ItemInput(BaseModel):
    """Schema para cada item dentro da lista de adição ao pedido"""

    product_id: UUID = Field(..., description="ID do produto sendo adicionado")
    quantity: int = Field(
        ..., gt=0, description="Quantidade do produto (deve ser maior que 0)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "product_id": "123e4567-e89b-12d3-a456-426614174000",
                "quantity": 2,
            }
        }


class AddItemsRequest(BaseModel):
    """Schema para adicionar múltiplos itens a um pedido de uma vez"""

    items: List[ItemInput] = Field(
        ..., min_length=1, description="Lista de itens a serem adicionados"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "items": [
                    {
                        "product_id": "123e4567-e89b-12d3-a456-426614174000",
                        "quantity": 2,
                    },
                    {
                        "product_id": "987fcdeb-51a2-43d1-bcde-123456789abc",
                        "quantity": 1,
                    },
                ]
            }
        }


class CancelItemRequest(BaseModel):
    """Schema para cancelar (total ou parcialmente) um item do pedido"""

    item_id: UUID = Field(..., description="ID do item do pedido a ser cancelado")
    quantity_to_cancel: int = Field(
        ..., gt=0, description="Quantidade a ser cancelada (deve ser maior que 0)"
    )
    reason: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Motivo do cancelamento (obrigatório, máximo 500 caracteres)",
    )

    class Config:
        json_schema_extra = {
            "example": {
                "item_id": "123e4567-e89b-12d3-a456-426614174000",
                "quantity_to_cancel": 1,
                "reason": "Cliente desistiu do produto",
            }
        }


class OrderItemResponse(BaseModel):
    """Schema para retornar os dados completos de um item do pedido"""

    id: UUID = Field(..., description="ID único do item do pedido")
    order_id: UUID = Field(..., description="ID do pedido ao qual este item pertence")
    product_id: UUID = Field(..., description="ID do produto")
    quantity: int = Field(..., description="Quantidade total original do item")
    cancelled_quantity: int = Field(default=0, description="Quantidade já cancelada")
    unit_price: float = Field(
        ..., gt=0, description="Preço unitário do produto no momento da adição"
    )
    status: ItemStatus = Field(..., description="Status atual do item")
    created_at: datetime = Field(..., description="Data de criação do item")

    class Config:
        from_attributes = True  # permite conversão direta de model SQLAlchemy
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "order_id": "987fcdeb-51a2-43d1-bcde-123456789abc",
                "product_id": "456abcde-12d3-43d1-bcde-426614174000",
                "quantity": 3,
                "cancelled_quantity": 0,
                "unit_price": 8.50,
                "status": "pending",
                "created_at": "2026-07-12T10:30:00Z",
            }
        }
