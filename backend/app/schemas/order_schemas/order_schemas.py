from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from datetime import datetime

class OrderCreate(BaseModel):
    table_id: UUID
    
class OrderRead(BaseModel):
    id: UUID
    table_id: UUID
    status: str
    people_count: int | None
    total_amount: Decimal | None
    opened_at: datetime
    closed_at: datetime | None
