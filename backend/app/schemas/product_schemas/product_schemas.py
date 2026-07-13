from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class ProductCreate(BaseModel):
    """Schema para criar um novo produto"""
    name: str = Field(..., min_length=1, description="Nome do produto (obrigatório, não vazio)")
    price: float = Field(..., gt=0, description="Preço do produto (obrigatório, deve ser maior que 0)")
    active: bool = Field(default=True, description="Status do produto (ativo/inativo)")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Picanha na Chapa",
                "price": 89.90,
                "active": True
            }
        }


class ProductUpdate(BaseModel):
    """Schema para atualizar um produto existente (todos os campos são opcionais)"""
    name: Optional[str] = Field(None, min_length=1, description="Nome do produto (opcional)")
    price: Optional[float] = Field(None, gt=0, description="Preço do produto (opcional, deve ser maior que 0)")
    active: Optional[bool] = Field(None, description="Status do produto (opcional)")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Picanha na Chapa (Grande)",
                "price": 109.90,
                "active": False
            }
        }


class ProductResponse(BaseModel):
    """Schema para retornar os dados de um produto (completo)"""
    id: UUID = Field(..., description="ID único do produto")
    name: str = Field(..., description="Nome do produto")
    price: float = Field(..., description="Preço do produto")
    active: bool = Field(..., description="Status do produto")
    created_at: datetime = Field(..., description="Data de criação do produto")

    class Config:
        from_attributes = True  # permite conversão direta do model SQLAlchemy
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Picanha na Chapa",
                "price": 89.90,
                "active": True,
                "created_at": "2026-07-12T10:30:00Z"
            }
        }