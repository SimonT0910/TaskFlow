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
    
class TaskResponse(BaseModel):
    task_id: int
    titulo: str
    descripcion: str
    estado: EstadoOut
    prioridad: int
    fecha_estimada: date | None
    tiempo: int | None
    creado: datetime
    actualizado: datetime
    
    class Config:
        orm_mode = True
        
class EstadoOut(BaseModel):
    nombre: str
    
    class Config:
        from_attributes = True