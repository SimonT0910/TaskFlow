from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

# ---------------------------
# USUARIOS
# ---------------------------

class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    email: str

class UsuarioCreate(UsuarioBase):
    contrasena: str

class UsuarioResponse(UsuarioBase):
    usuario_id: int
    fecha: datetime

    class Config:
        orm_mode = True


# ---------------------------
# ESTADOS
# ---------------------------

class EstadoResponse(BaseModel):
    estado_id: int
    nombre: str

    class Config:
        orm_mode = True


# ---------------------------
# TASKS
# ---------------------------

class TaskBase(BaseModel):
    titulo: str
    descripcion: str
    estado_id: int
    prioridad: Optional[int] = None
    fecha_estimada: Optional[date] = None
    tiempo: Optional[int] = None

class TaskCreate(TaskBase):
    usuario_id: int

class TaskResponse(TaskBase):
    task_id: int
    creado: datetime
    actualizado: datetime

    class Config:
        orm_mode = True


# ---------------------------
# CALENDARIO
# ---------------------------

class CalendarioBase(BaseModel):
    titulo: str
    descripcion: str
    comienzo: Optional[date] = None
    final: Optional[date] = None
    subtareas: Optional[int] = None

class CalendarioCreate(CalendarioBase):
    usuario_id: int

class CalendarioResponse(CalendarioBase):
    evento_id: int

    class Config:
        orm_mode = True


# ---------------------------
# HISTORIAL
# ---------------------------

class HistorialCreate(BaseModel):
    task_id: int
    usuario_id: int
    estado_anterior: Optional[int] = None
    nuevo_estado: Optional[int] = None
    comentario: Optional[str] = None

class HistorialResponse(HistorialCreate):
    historial_id: int
    cambio: datetime

    class Config:
        orm_mode = True


# ---------------------------
# SUGERENCIAS IA
# ---------------------------

class SugerenciaCreate(BaseModel):
    usuario_id: int
    tipo: Optional[str] = None
    sugerencia: Optional[str] = None
    task_relacionado: Optional[int] = None

class SugerenciaResponse(SugerenciaCreate):
    sugerencia_id: int
    creado: datetime
    aplicado: bool

    class Config:
        orm_mode = True


# ---------------------------
# RECOMENDACIONES IA
# ---------------------------

class RecomendacionCreate(BaseModel):
    usuario_id: int
    input_text: Optional[str] = None
    output_text: Optional[str] = None

class RecomendacionResponse(RecomendacionCreate):
    log_id: int
    creado: datetime

    class Config:
        orm_mode = True
