# app/crud/users.py
from sqlalchemy.orm import Session
from app import models, schemas
from app.utils.security import hash_password, verify_password

def get_user_by_email(db: Session, email: str):
    """Busca usuario por email"""
    return db.query(models.Usuario).filter(models.Usuario.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    """Busca usuario por ID"""
    return db.query(models.Usuario).filter(models.Usuario.usuario_id == user_id).first()

def create_user(db: Session, user: schemas.UsuarioCreate):
    """Crea nuevo usuario con contraseña hasheada"""
    # Verificar si el email ya existe
    existing = get_user_by_email(db, user.email)
    if existing:
        return None  # Usuario ya existe
    
    # Hashear contraseña
    hashed_password = hash_password(user.contrasena)
    
    # Crear usuario
    db_user = models.Usuario(
        nombre=user.nombre,
        apellido=user.apellido,
        email=user.email,
        contrasena=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    """Autentica usuario (login)"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.contrasena):
        return None
    return user

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los usuarios (paginado)"""
    return db.query(models.Usuario).offset(skip).limit(limit).all()