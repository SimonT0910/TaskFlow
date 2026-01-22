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

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):  
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
@router.delete("/delete/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(
    task_id: int, 
    db: Session = Depends(get_db), 
    current_user: Usuario = Depends(get_current_user)
    ):
    task = db.query(Task).filter(
        Task.task_id == task_id,
        Task.usuario_id == current_user.usuario_id
        ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    if task.estado.nombre != "Finalizado":
        raise HTTPException(
            status_code=400,
            detail="Solo se pueden eliminar tareas finalizadas"
        )
        
    #Eliminar primero el historial
    db.query(Historial).filter(
        Historial.task_id == task.task_id
    ).delete(synchronize_session=False)

    db.delete(task)
    db.commit()
    
    return {"message": "Tarea eliminada correctamente"}

#Eliminación masiva
@router.delete("/delete-completed")
def delete_completed(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    #1. Buscar tareas finalizadas del usuario
    final = (
        db.query(Task).join(Estado).filter(
            Task.usuario_id == current_user.usuario_id,
            Estado.nombre == "Finalizado"
        ).all()
    )
    
    if not final:
        return {
            "deleted": 0,
            "message": "No hay tareas finalizadas para eliminar"
        }
    
    #2. Obtener IDs de tareas
    task_ids = [t.task_id for t in final]
    
    #3. Eliminar historial asociado
    db.query(Historial).filter(
        Historial.task_id.in_(task_ids)
    ).delete(synchronize_session=False)
    
    #4. Eliminar tareas
    for task in final:
        db.delete(task)
        
    db.commit()
    
    return {
        "deleted": len(task_ids),
        "message": f"Se eliminaron {len(task_ids)} tareas finalizadas"
    }
    
#Asegura que la tarea exista para el cambio de estado
@router.patch("/{task_id}/estado", response_model=TaskResponse)
def change(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) :
    #1. Buscar la tarea
    task = db.query(Task).filter(
        Task.task_id == task_id,
        Task.usuario_id == current_user.usuario_id
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
    if task.estado.nombre == "Pendiente":
        nuevo = db.query(Estado).filter(Estado.nombre == "En curso").first()
    elif task.estado.nombre == "En curso":
        nuevo = db.query(Estado).filter(Estado.nombre == "Finalizado").first()
        
    #4. Actualizar fecha
    task.estado_id = nuevo.estado_id
    task.actualizado = datetime.now()
    
    #5. Guardar historial
    historial = Historial(
        task_id = task.task_id,
        usuario_id = current_user.usuario_id,
        estado_anterior = anterior,
        nuevo_estado = nuevo.estado_id,
    )
    
    db.add(historial)
    db.commit()
    db.refresh(task)
    
    return task 

#Utiliza la funcion drag-and-drop para mover las actividades en el calendario
@router.patch("/tasks/{task_id}")
def update_date(task_id: int, data: dict, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    if task.estado == "Finalizado":
        raise HTTPException(status_code=400, detail="No se puede mover una tarea finalizada")
    
    task.fecha_estimada = data["fecha_estimada"]
    db.commit()
    
    return {"message": "Fecha actualizada correctamente"}