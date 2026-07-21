from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Nome da categõria)")
    
    class Conffig:
        json_schame_extra = {
            "example": {"name": "Bebidas"}
        }
        
        class CategoryUpdate(BaseModel):
            name: Optional[str] = Field(None, min_length=1, max_length=100, description="Novo nome da categoria (opcional)")
            active: Optional[bool] = Field(None, description="Novo status ativo/inativo da categoria (opcional)")
            
            class Config:
                json_schema_extra = {
                    "example": {"name": "Bebidas e Sucos", "active": True}
                }
                
                class CategoryResponse(BaseModel):
                    id: UUID = Field(..., description="ID único da categoria")
                    name: str = Field(..., description="Nome da categoria")
                    active: bool = Field(..., description="Status ativo/inativo da categoria")
                    created_at: datetime = Field(..., description="Data de criação da categoria")
                    
                    class Config:
                        from_attributes = True
                        json_schema_extra = {
                            "example": {
                                "id": "123e4567-e89b-12d3-a456-426614174000",
                                "name": "Bebidas",
                                "active": True,
                                "created_at": "2026-07-12T10:30:00Z"
                            }
                        }