#Esquemas que basan el modelo que se va a ver en el frontend
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskCreate(BaseModel):
    titulo: str
    descripcion: str
    prioridad: Optional[int] = None
    fecha_estimada: Optional[date] = None
    tiempo: Optional[int] = None
    
#Actualiza solo los campos aqui indicados
class TaskUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_estimada: Optional[date] = None
    tiempo: Optional[int] = None
    
class TaskResponse(BaseModel):
    task_id: int
    titulo: str
    descripcion: str
    estado: EstadoOut
    prioridad: int
    fecha_estimada: date | None
    tiempo: int | None
    asignado: bool
    creado: datetime
    actualizado: datetime
    asignado: Optional[int] = None
    admin_in: bool
    
    class Config:
        orm_mode = True
        
class EstadoOut(BaseModel):
    nombre: str
    
    class Config:
        from_attributes = True

#Para las tareas asignadas por el administrador        
class AdminTasks(BaseModel):
    titulo: str
    descripcion: str
    prioridad: int | None = None
    fecha_estimada: date
    tiempo: int
    usuario_id: int
    proyecto_id: int