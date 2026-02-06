from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Admin
from app.schemas.admin import AdminLogin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login")
def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(
        Admin.usuario_id == data.usuario_id
    ).first()
    
    if not admin or admin.admin_contrasena != data.contrasena:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    return {"message": "Acceso administrador concedido"}