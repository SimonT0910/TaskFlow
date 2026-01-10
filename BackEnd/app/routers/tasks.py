#Ruta para cada usuario y para los diferesntes datos de tareas en el frontend
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import Task, Estado, Usuario, Historial
from app.schemas import TaskCreate
from app.auth.dependencies import get_current_user
from typing import List
from app.schemas.task import TaskResponse
from app.schemas.task import TaskUpdate

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
        creado = datetime.now(),
        actualizado = datetime.now()
    )
    
    #3. Guardar en la base de datos
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    
    return TaskResponse(
        task_id = nueva_tarea.task_id,
        titulo = nueva_tarea.titulo,
        descripcion = nueva_tarea.descripcion,
        estado = {
            "nombre": nueva_tarea.estado.nombre
        },
        prioridad = nueva_tarea.prioridad,
        fecha_estimada = nueva_tarea.fecha_estimada,
        tiempo = nueva_tarea.tiempo,
        creado = nueva_tarea.creado,
        actualizado = nueva_tarea.actualizado
    )

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
            estado={
                "nombre": t.estado.nombre
            },
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
    
#Verifica si la tarea existe para proceder con su debida actualizacion de ser pedida
@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    #1. Buscar la tarea
    tarea = db.query(Task).filter(
        Task.task_id == task_id,
        Task.usuario_id == current_user.usuario_id
    ).first()
    
    if not tarea:
        raise HTTPException(
            status_code=404,
            detail="Tarea no encontrada"
        )
        
    #2. Actualizar solo los campos enviados
    if task_data.titulo is not None:
        tarea.titulo = task_data.titulo
        
    if task_data.descripcion is not None:
        tarea.descripcion = task_data.descripcion
        
    if task_data.fecha_estimada is not None:
        tarea.fecha_estimada = task_data.fecha_estimada
    
    if task_data.tiempo is not None:
        tarea.tiempo = task_data.tiempo
        
    #3. Actualizar fecha de modificacion
    tarea.actualizado = datetime.now()
    
    #4. Guardar cambios
    db.commit()
    db.refresh(tarea)
    
    return tarea
    
#Eliminar la tarea
@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    usuario = Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.task_id == task_id,
        Task.usuario_id == usuario.usuario_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=404,
            detail="Tarea no encontrada"
        )
    
    db.delete(task)
    db.commit()
    
#Asegura que la tarea exista para el cambio de estado
@router.patch("/tasks/{task_id}/estado")
def change(
    task_id: int,
    db: Session = Depends(get_db),
    usuario = Depends(get_current_user)
) :
    #1. Buscar la tarea
    task = db.query(Task).filter(
        Task.task_id == task_id,
        Task.usuario_id == usuario.usuario_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    #2. Validar que no esté finalizada
    if task.estado_id == 3:
        raise HTTPException(
            status_code=400,
            detail="La tarea ya esta finalizada"
        )
    
    anterior = task.estado_id
    
    #3. Logica de avance de estado
    if task.estado_id == 1:
        task.estado_id = 2
    elif task.estado_id == 2:
        task.estado_id = 3
        
    #4. Actualizar fecha
    task.actualizado = datetime.now()
    
    #5. Guardar historial
    historial = Historial(
        task_id = task.task_id,
        usuario_id = usuario.usuario_id,
        anterior = anterior,
        nuevo = task.estado_id,
        comentario = "Cambio de estado por deslizamiento"
    )
    
    db.add(historial)
    db.commit()
    db.refresh(task)
    
    return task