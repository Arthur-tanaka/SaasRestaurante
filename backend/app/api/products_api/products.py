from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from ..schemas.product_schemas import ProductCreate, ProductUpdate, ProductResponse
from ..services.product_service import (
    ProductService,
    ProductNotFoundException,
    InvalidProductPriceException,
)

from ..dependencies import get_product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate, service: ProductService = Depends(get_product_service)
):
    
    try:
        return service.create_product(
            name=payload.name,
            price=payload.price,
            active=payload.active,
        )
        
    except (ValueError, InvalidProductPriceException) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/", response_model=List[ProductResponse])
def get_all_products(service: ProductService = Depends(get_product_service)):
    return service.get_all_products()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: UUID, service: ProductService = Depends(get_product_service)
):
    
    try:
        return service.get_product(product_id)
    except ProductNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/{product_id}/price", response_model=ProductResponse)
def update_product_price(
    product_id: UUID,
    payload: ProductUpdate,
    service: ProductService = Depends(get_product_service),
):
    if payload.price is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O campo 'price' é obrigatório para atualizar o preço",
        )
        
    try:
        return service.update_price(product_id, payload.price)
    except ProductNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidProductPriceException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_product(
    product_id: UUID, service: ProductService = Depends(get_product_service)
):
    try:
        service.deactivate_product(product_id)
    except ProductNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))



""" 

Módulo de Rotas de Produtos
---------------------------

Gerencia as operações CRUD e de status para produtos no sistema.*args

Endpoints:
    
    POST       /products                -   Cria um novo produto (nome obrigátorio, preço . 0)
    GET       /products                 -   Lista todos os produtos ativos 
    GET      /prodcuts/{id}             -   Busca um produto especcífico pelo UUID
    PATCH   /products/{id}price         -   Atualiza apenas o preço do produto
    DELETE /products/{id}               -   Desative o produto (self delete)
    
Tratamento de Erros:

    - 400: Dados Inválidos (nome vazio, preço <= 0, preice ausente)
    - 404: Produto não encontrado
    - 201: Criação bem-sucedida
    - 204: Destivação bem-sucedidada (sem corpo)
    
Dependência:

    - ProductsService: Lógica de negócio e regras de validação
    - ProductCreate/update/Response: Schemas Pydantic para entrada;saída
    
Validações:

    - Nome: Obrigatório, não pode ser vazio (min_length=1)
    - Preço: Obrigatório, deve ser > 0 (gt=0)
    - Ativo: booleano, default True
    
    Rotas CRUD para gerenciamento de produtos.
    
    Criação, listagem, busca, atualização de preço e desativação (solf, delete)
    Tratamento de erros: 400 (validação), 404 (não encontrado), 201/204 (sucesso)
    Validações: nome não vazio, preço > 0

"""