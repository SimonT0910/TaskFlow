from pydantic import BaseModel
from typing import List
from datetime import date

class AdminTaskCreate(BaseModel):
    titulo: str
    descripcion: str
    prioridad: int | None = None
    fecha_estimada: date
    tiempo: int
    usuarios_asignados: List[int]
    admin_id: int