#Ruta para cada usuario y para los diferesntes datos de tareas en el frontend
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import Task, Estado, Usuario
from app.schemas import TaskCreate
from app.auth.dependencies import get_current_user
from typing import List
from app.schemas.task import TaskResponse

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Crea una nueva tarea para el usuario autenticado.
    El estado siempre inicia en 'Pendiente'.
    """
    
    #1. Buscar el estado "Pendiente"
    estado_pendiente = (
        db.query(Estado).filter(Estado.nombre == "Pendiente").first()
    )
    
    if not estado_pendiente:
        raise HTTPException(
            status_code=500,
            detail="Estado 'Pendiente' no existe en la base de datos."
        )
    
    #Crear la tarea
    nueva_tarea = Task (
        usuario_id = current_user.usuario_id,
        titulo = task.titulo,
        descripcion = task.descripcion,
        prioridad = task.prioridad,
        fecha_estimada = task.fecha_estimada,
        tiempo = task.tiempo,
        estado_id = estado_pendiente.estado_id,
        creado = datetime.utcnow(),
        actualizado = datetime.utcnow()
    )
    
    #3. Guardar en la base de datos
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    
    return {
        "message": "Tarea creada correctamente",
        "task_id": nueva_tarea.task_id,
        "estado": "Pendiente"
    }

#Separa cada tarea por usuario 
@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    tareas = (
        db.query(Task)
        .join(Estado).filter(Task.usuario_id == current_user.usuario_id)
        .all()
    )
    
    return [
        TaskResponse(
            task_id=t.task_id,
            titulo=t.titulo,
            descripcion=t.descripcion,
            estado_id=t.estado.nombre,
            prioridad=t.prioridad,
            fecha_estimada=t.fecha_estimada,
            tiempo=t.tiempo,
            creado=t.creado,
            actualizado=t.actualizado
        )
        for t in tareas
    ]
    
#Se consulta la informacion completa de una tarea
@router.get("/{task_id}", response_model=TaskResponse)
def get_task_detail(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    tarea = (
        db.query(Task)
        .join(Estado)
        .filter(
            Task.task_id == task_id,
            Task.usuario_id == current_user.usuario_id
        )
        .first()
    )
    
    if not tarea:
        raise HTTPException(
            status_code=404,
            detail="Tarea no encontrada"
        )
    
    return TaskResponse(
        task_id=tarea.task_id,
        titulo=tarea.titulo,
        descripcion=tarea.descripcion,
        estado_id=tarea.estado.nombre,
        prioridad=tarea.prioridad,
        fecha_estimada=tarea.fecha_estimada,
        tiempo=tarea.tiempo,
        creado=tarea.creado,
        actualizado=tarea.actualizado
    )