from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from ..schemas.product_schemas import ProductCreate, ProductUpdate, ProductResponse
from ...service.product_service import ProductService
from ...dependencies import get_product_service # Assumindo que voce tem essa depedencia
from ...exceptions import ProductNotFoundException, InvalidProductPriceException, ProductAlreadyExitsException

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    service: ProductService = Depends(get_product_service)
):
    """
     
    Cria um novo Produto.
    
    - **name**: Nome do produto (obrigatório, não vazio)
    - **price**: Preço do produto (obrigatório, deve ser > 0)
    - **active**: Status do produto (opcional, default True)
    
    """
    try:
        product = service.create_product(
            name=payload.name,
            price=payload.price,
            active=payload.active
        )
        
        return product
    except ProductAlreadyExitsException as e:
        raise HTTPException(status_code=status.HTTP_400_CONFLICT, detail=str(e))
    except (ValueError, InvalidProductPriceException) as e:
        # ValueError para nome, vazio InvalidProductPriceExcpetion para preço inválido
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.get("/", response_model=List[ProductResponse])
def get_all_products(
    active_only: bool = True, # Primeiro opcional via query string
    service: ProductService = Depends(get_product_service)
):
    
    """ 
    
    Lista todos os produtos (ou apenas os ativos).
    
    - **active_only**: Se True (default), retorna apenas produtos ativos.
                          Se false, retorna todos (ativos e inativos).
    
    """
    products = service.get_all_products(active_only=active_only)
    return products

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: UUID,
    service: ProductService = Depends(get_product_service)
):
    
    """ 
    
    Busca um produto especifico pelo ID.
    
    - **product_id**: UUID do produto
    
    """
    try:
        product = service.get_product(product_id)
        return product
    except ProductNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/{product_id}/price", response_model=ProductResponse)
def update_product_price(
    product_id: UUID,
    payload: ProductUpdate, # Reutilizando ProducctUpdate com price opcional
    service: ProductService = Depends(get_product_service)
):
    
    """
    
    Atualiza o preço de um produto.
    
    - **product_id**: UUID do produto
    - **price**: Novo preço (obrigatório no body, deve ser > 0) 
    
    """
    
    # Validação especcifica: pricce é obrigatório nesta rota
    if payload.price is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O campo 'price' é obrigatório para atualizar o preço"
        )
        
        try:
            product = service.update_price(product_id, payload.price)
            return product
        except ProductNotFoundException as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        except InvalidProductPriceException as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_product(
    product_id: UUID,
    service: ProductService = Depends(get_all_products)
):
    """ 
    
    Desativa um produto (soft delete).*args
    
    - **prodcut_id**: UUID do produto a ser desativado
    
    """
    try:
        service.deactivate_product(product_id)
        # Retorna 204 no Content sem corpo
        
    except ProductNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: UUID,
    payload: ProductUpdate,
    serive: ProductService = Depends(get_all_products)
):
    """ 
    
    Atualiza campos espcíficco de um produto (nome, preço status).
    Todos os campos são opcionais
    
    """