# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.Database import get_db
from app import schemas
from app.crud import users as crud_users
from app.utils.security import (
    create_access_token, 
    verify_password,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(tags=["autenticación"])

# Configuración OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/register", response_model=schemas.UsuarioResponse)
def register(
    usuario: schemas.UsuarioCreate,
    db: Session = Depends(get_db)
):
    """
    Registra un nuevo usuario
    """
    # Verificar si usuario ya existe
    db_user = crud_users.get_user_by_email(db, email=usuario.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )
    
    # Crear usuario
    nuevo_usuario = crud_users.create_user(db=db, user=usuario)
    if not nuevo_usuario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo crear el usuario"
        )
    
    return nuevo_usuario

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login de usuario - Retorna token JWT
    """
    # Autenticar usuario
    user = crud_users.authenticate_user(
        db, 
        email=form_data.username,  # OAuth2 usa 'username' para email
        password=form_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.usuario_id),
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.usuario_id,
        "email": user.email,
        "name": f"{user.nombre} {user.apellido}"
    }

@router.get("/me", response_model=schemas.UsuarioResponse)
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Obtiene información del usuario actual usando el token
    """
    from app.utils.security import decode_token
    
    # Decodificar token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    # Buscar usuario
    user = crud_users.get_user_by_id(db, user_id=int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return user