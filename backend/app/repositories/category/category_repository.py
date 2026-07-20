from sqlalchemy.orm import Session
from uuid import UUID
from app.models.category.category import Category

class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db
        
    def get_by_id(self, category_id: UUID) -> Category | None:
        """ Busca uma Categoria pelo ID """
        return self.db.query(Category).filter(Category.id == category_id).first()
    
    def list_active(self) -> list[Category]:
        """ Lista todas as categorias ativas """
        return self.db.query(Category).filter(Category.activo == True).all()
    
    def create(self, category: Category) -> Category:
        """ Cria uma nova categoria """
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category
    
    def deactivate(self, category_id: UUID) -> bool:
        category = self.get_by_id(category_id)
        if not category:
            return False
        
        category.active = False
        self.db.commit()
        return True