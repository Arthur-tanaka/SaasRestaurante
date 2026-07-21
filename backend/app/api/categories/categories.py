from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.core.database import get_db
from app.schemas.category_schemas import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services.category_service import CategoryService, CategoryNotFoundException

router = APIRouter(prefix="/categories", tags=["categories"])


def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(db)


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    service: CategoryService = Depends(get_category_service)
):
    try:
        return service.create_category(payload.name)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/", response_model=List[CategoryResponse])
def list_categories(
    service: CategoryService = Depends(get_category_service)
):
    return service.get_all_categories()


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: UUID,
    service: CategoryService = Depends(get_category_service)
):
    try:
        return service.get_category(category_id)
    except CategoryNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: UUID,
    payload: CategoryUpdate,
    service: CategoryService = Depends(get_category_service)
):
    try:
        return service.update_category(category_id, name=payload.name, active=payload.active)
    except CategoryNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_category(
    category_id: UUID,
    service: CategoryService = Depends(get_category_service)
):
    try:
        service.deactivate_category(category_id)
    except CategoryNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))