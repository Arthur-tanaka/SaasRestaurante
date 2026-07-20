from uuid import UUID
from sqlalchemy.orm import Session
from app.models.product import Product
from app.repositories.product_repository import ProductRepository


class InvalidProductPriceException(Exception):
    pass


class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.product_repo = ProductRepository(db)

    def update_price(self, product_id: UUID, new_price: float) -> Product:
        product = self.product_repo.get_by_id(product_id)

        if product is None:
            raise ValueError(f"Produto {product_id} não encontrado")

        if new_price <= 0:
            raise InvalidProductPriceException("Preço deve ser maior que zero")

        product.price = new_price
        return self.product_repo.update(product)

    def create_product(self, name: str, price: float) -> Product:
        if not name or len(name.strip()) == 0:
            raise ValueError("Nome do produto é obrigatório")

        if price <= 0:
            raise InvalidProductPriceException("Preço deve ser maior que zero")

        product = Product(
            name=name.strip(),
            price=price,
        )
        return self.product_repo.create(product)

    def get_product(self, product_id: UUID) -> Product:
        product = self.product_repo.get_by_id(product_id)

        if product is None:
            raise ValueError(f"Produto {product_id} não encontrado")

        return product

    def get_all_products(self) -> list[Product]:
        return self.product_repo.list_active()

    def deactivate_product(self, product_id: UUID) -> bool:
        self.get_product(product_id) 
        return self.product_repo.deactivate(product_id)