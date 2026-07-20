from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.category import Category

class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db
        
        def create(self, category: Category) -> Category:
            """ Cria uma categoria. """
            self.db.add(category)
            self.db.commit()
            self.db.refresh(category)
            return category
        
        def get_by_id(self, category_id: UUID) -> Optional[Category]:
            """ Busca categoria por ID. """
            return self.db.query(Category).filter(Category.id == category_id).first()
        
        def list_active(self) -> List[Category]:
            """ Lista todas as categorias ativas. """
            return self.db.query(Category).filter(Category.active == True).all()
        
        def deactivate(self, category_id: UUID) -> bool:
            """ Desativa uma categoria. """
            category = self.get_by_id(category_id)
            if category:
                category.active = False
                self.db.commit()
                return True
            return False