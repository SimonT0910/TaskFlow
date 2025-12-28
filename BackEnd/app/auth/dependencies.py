#Dependencias para poder detectar el usuario autenticado
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.jwt import verify_token
from app.models import Usuario

def get_current_user (
    token: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter (
        Usuario.usuario_id == token["user_id"]
    ).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    
    return usuario