# app/core/database.py

from sqlalchemy import create_engine        # função pra criar a conexão com o banco
from sqlalchemy.orm import DeclarativeBase, sessionmaker   # DeclarativeBase + sessionmaker

DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5433/restaurante"

engine = create_engine(DATABASE_URL)

class Base(DeclarativeBase):
    pass

SessionLocal = sessionmaker(bind=engine)