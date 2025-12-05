from sqlalchemy import Column, Integer, String, DateTime, Date, Text, ForeignKey, Boolean
from sqlalchemy.orm import retionship
from datetime import datetime
from app.database import Base

#Tabla de usuarios

class Usuario(Base):
    __tablename__ = "usuarios"
    
    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(20), nullable=False)
    apellido = Column(String(20), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    contrasena = Column(String(100), unique=True, nullable=False)
    fecha = Column(DateTime, default=datetime.now)
    
    #Relaciones
    tasks = relationship("Task", back_populates="usuario")
    calendario = relationship("Calendario", back_populates="usuario")
    historial = relationship("Historial", back_populates="usuario")
    sugerencias = relationship("SugerenciaIA", back_populates="usuario")
    recomendaciones = relationship("RecomendacionIA", back_populates="usuario")

#Tabla de estados

class Estado(Base):
    __tablename__ = "estados"
    
    estado_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(10), nullable=False)
    
    #Relaciones
    tasks = relationship("Tasks", back_populates="estado")
    
#Tabla de tareas

class Task(Base):
    __tablename__ = "tasks"
    
    task_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    titulo = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=False)
    estado_id = Column(Integer, ForeignKey("estados.estado_id"), nullable=False)
    prioridad = Column(Integer)
    fecha_estimada = Column(Date)
    tiempo = Column(Integer)
    creado = Column(DateTime, default=datetime.now)
    actualizado = Column(DateTime, default=datetime.now)
    
    #Relaciones
    usuario = realtionship("Usuario", back_populates="tasks")
    estado = relationship("Estado", back_populates="tasks")
    historial = relationship("Historial", back_populates="tasks")
    subtareas = realtionship("Calendario", back_populates="subtarea_task")
    sugerencias_rel = relationship("SugerenciaIA", back_populates="task_relacionadas")
    
#Tabla del calendario

class Calendario(Base):
    __tablename__ = "calendario"
    
    evento_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    titulo = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=False)
    comienzo = Column(Date)
    final = Column(Date)
    subtareas = Column(Integer, ForeignKey("tasks.task_id"), nullable=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="calendario")
    subtarea_task = relationship("Task", back_populates="subtareas")
    
#Tabla del historial

class Historial(Base):
    __tablename__ = "historial"

    historial_id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.task_id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    estado_anterior = Column(Integer)
    nuevo_estado = Column(Integer)
    cambio = Column(DateTime, default=datetime.now)
    comentario = Column(Text)

    # Relaciones
    task = relationship("Task", back_populates="historial")
    usuario = relationship("Usuario", back_populates="historial")

#Tabla de sugerencias IA

class SugerenciaIA(Base):
    __tablename__ = "sugerenciasIA"

    sugerencia_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    tipo = Column(String(50))
    sugerencia = Column(Text)
    creada = Column(DateTime, default=datetime.now)
    apicado = Column(Boolean, default=False)
    task_relacionado = Column(Integer, ForeignKey("tasks.task_id"), nullable=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="sugerencias")
    task_relacionada = relationship("Task", back_populates="sugerencias_rel")

#Tabla de recomendaciones IA

class RecomendacionIA(Base):
    __tablename__ = "recomendacionesIA"

    log_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    input_text = Column(Text)
    output_text = Column(Text)
    creado = Column(DateTime, default=datetime.now)

    # Relaciones
    usuario = relationship("Usuario", back_populates="recomendaciones")