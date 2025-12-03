# Database.py - VERSIÓN CORREGIDA
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# CADENA DE CONEXIÓN A TU SQL SERVER
DATABASE_URL = (
    "mssql+pyodbc://DESKTOP-D6A13IA/TaskFlow"
    "?driver=ODBC+Driver+17+for+SQL+Server"
    "&trusted_connection=yes"
)

# Crear engine
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Muestra las consultas SQL en consola
    fast_executemany=True
)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# ¡FALTA ESTA FUNCIÓN! - AGREGALA
def get_db():
    """Dependency para obtener sesión de BD en FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()