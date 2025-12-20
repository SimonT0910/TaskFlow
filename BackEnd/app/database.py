import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#Usamos la cadena para la autenticacion windows con la base de datos
DATABASE_URL = os.getenv("DATABASE_URL", "mssql+pyodbc://DESKTOP-D6A13IA/TaskFlow?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes")

#engine SQLAlchemy (echo True muestra diferentes queries en la consola)
engine = create_engine(DATABASE_URL, echo=True, fast_executemany=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

#Dependencias para las FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db #convierte una funcion en un generador
    finally:
        db.close()