from sqlalchemy import Column, Integer, String, DateTime, Date, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .Database import Base
from datetime import datetime

class Usuario(Base):
    __tablename__ = "usuarios"

    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(20), nullable=False)
    apellido = Column(String(20), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    contrasena = Column(String(100), unique=True, nullable=False)
    fecha = Column(DateTime, default=datetime.now)

    tasks = relationship("Task", back_populates="usuario")
    eventos = relationship("Calendario", back_populates="usuario")
    historial = relationship("Historial", back_populates="usuario")
    sugerencias = relationship("SugerenciaIA", back_populates="usuario")
    recomendaciones = relationship("RecomendacionIA", back_populates="usuario")


class Estado(Base):
    __tablename__ = "estados"

    estado_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(10), nullable=False)

    tasks = relationship("Task", back_populates="estado")


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

    usuario = relationship("Usuario", back_populates="tasks")
    estado = relationship("Estado", back_populates="tasks")
    subtareas = relationship("Calendario", back_populates="task_relacionada")
    historial = relationship("Historial", back_populates="task")
    sugerencias = relationship("SugerenciaIA", back_populates="task_relacionada")


class Calendario(Base):
    __tablename__ = "calendario"

    evento_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"))
    titulo = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=False)
    comienzo = Column(Date)
    final = Column(Date)
    subtareas = Column(Integer, ForeignKey("tasks.task_id"))

    usuario = relationship("Usuario", back_populates="eventos")
    task_relacionada = relationship("Task", back_populates="subtareas")


class Historial(Base):
    __tablename__ = "historial"

    historial_id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.task_id"))
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"))
    estado_anterior = Column(Integer)
    nuevo_estado = Column(Integer)
    cambio = Column(DateTime, default=datetime.now)
    comentario = Column(Text)

    task = relationship("Task", back_populates="historial")
    usuario = relationship("Usuario", back_populates="historial")


class SugerenciaIA(Base):
    __tablename__ = "sugerenciasIA"

    sugerencia_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"))
    tipo = Column(String(50))
    sugerencia = Column(Text)
    creada = Column(DateTime, default=datetime.now)
    aplicado = Column(Boolean, default=False)
    task_relacionado = Column(Integer, ForeignKey("tasks.task_id"))

    usuario = relationship("Usuario", back_populates="sugerencias")
    task_relacionada = relationship("Task", back_populates="sugerencias")


class RecomendacionIA(Base):
    __tablename__ = "recomendacionesIA"

    log_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"))
    input_text = Column(Text)
    output_text = Column(Text)
    creado = Column(DateTime, default=datetime.now)

    usuario = relationship("Usuario", back_populates="recomendaciones")
