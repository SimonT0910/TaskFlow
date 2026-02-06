from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Proyecto ,Task
from app.schemas.adminTasks import AdminTaskCreate
from app.core.security import verify_password

router = APIRouter(prefix="/adminTask", tags=["AdminTask"])

@router.post("/create")
def create_task(data: AdminTaskCreate, db: Session = Depends(get_db)):
    
    proyecto = db.query(Proyecto).filter(
        Proyecto.proyecto_id == data.proyecto_id
    ).first()
    
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    if not verify_password(data.admin_password, proyecto.admin_password_hash):
        raise HTTPException(status_code=401, detail="Contraseña de administrador incorrecta")
    
    #Si pasa esta validación se crean las tareas
    for usuaio_id in data.usuarios_asignados:
        task = Task(
            titulo=data.titulo,
            descripcion=data.descripcion,
            prioridad=data.prioridad,
            fecha_estimada=data.fecha_estimada,
            tiempo=data.tiempo,
            usuario_id=data.admin_id,
            asignado_id=usuaio_id,
            admin_in=True,
            estado_id=1
        )
        db.add(task)
        
    db.commit()
    return {"message": "Tareas creadas y asignadas correctamente"}