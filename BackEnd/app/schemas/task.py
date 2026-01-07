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
    prioridad: Optional[int]
    fecha_estimada: Optional[date]
    tiempo: Optional[int]
    creado: datetime
    
    class Config:
        orm_mode = True
        
class EstadoOut(BaseModel):
    estado_id: int
    nombre: str
    
    class Config:
        from_attributes = True