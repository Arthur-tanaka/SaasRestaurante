# repositories/product_repository.py
from sqlalchemy.orm import Session
from uuid import UUID
from app.models.product.product import Product

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, product_id: UUID) -> Product | None:
        return self.db.query(Product).filter(Product.id == product_id).first()

    def list_active(self) -> list[Product]:
        return self.db.query(Product).filter(Product.active.is_(True)).all()

    def create(self, product: Product) -> Product:
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update(self, product: Product) -> Product:
        self.db.commit()
        self.db.refresh(product)
        return product

    def deactivate(self, product_id: UUID) -> bool:
        product = self.get_by_id(product_id)
        if product:
            product.active = False
            self.db.commit()
            return True
        return False