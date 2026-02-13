from sqlalchemy import Column, Integer, String, DateTime, Date, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

#Tabla de usuarios

class Usuario(Base):
    __tablename__ = "usuarios"

    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(20), nullable=False)
    apellido = Column(String(20), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    contrasena = Column(String(100), nullable=False)
    fecha = Column(DateTime)
    password_hash = Column(String(255), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    creado = Column(DateTime)

    #Relaciones 
    tasks_creadas = relationship("Task", foreign_keys="Task.usuario_id", back_populates="usuario")
    tasks_asignadas = relationship("Task", foreign_keys="Task.asignado", back_populates="usuario_asignado")
    historial = relationship("Historial", back_populates="usuario")
    sugerencias = relationship("SugerenciaIA", back_populates="usuario")
    recomendaciones = relationship("RecomendacionIA", back_populates="usuario")
    calendario = relationship("Calendario", back_populates="usuario")
    proyectos = relationship("UsuarioProyecto", back_populates="usuario")

#Tabla de estados

class Estado(Base):
    __tablename__ = "estados"

    estado_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(10), nullable=False)
    
    #Relaciones
    tasks = relationship("Task", back_populates="estado")
    
#Tabla de tareas

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey("proyectos.proyecto_id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    asignado = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=True)
    titulo = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=False)
    estado_id = Column(Integer, ForeignKey("estados.estado_id"), nullable=False)
    prioridad = Column(Integer)
    fecha_estimada = Column(Date)
    tiempo = Column(Integer)
    creado = Column(DateTime)
    actualizado = Column(DateTime)
    admin_in = Column(Boolean, nullable=False, default=False)

    #Relaciones
    usuario = relationship("Usuario", foreign_keys=[usuario_id], back_populates="tasks_creadas")
    usuario_asignado = relationship("Usuario", foreign_keys=[asignado], back_populates="tasks_asignadas")
    estado = relationship("Estado", back_populates="tasks")
    proyecto = relationship("Proyecto", back_populates="tareas")
    historial = relationship("Historial", back_populates="task")
    sugerencias = relationship("SugerenciaIA", back_populates="task")
    subtareas = relationship("Calendario", back_populates="subtarea_task")

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
    
    #Relaciones
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
    task_id = Column(Integer, ForeignKey("tasks.task_id"), nullable=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="sugerencias")
    task = relationship("Task", back_populates="sugerencias")

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
    
#Tabla de los proyectos

class Proyecto(Base):
    __tablename__= "proyectos"
    
    proyecto_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    admin_usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    admin_password_hash = Column(String(255), nullable=False)
    creado = Column(DateTime, default=datetime.now())
    
    #Relación
    admin = relationship("Usuario")
    usuarios = relationship("UsuarioProyecto", back_populates="proyecto")
    tareas = relationship("Task", back_populates="proyecto")
    
#Tabla que une usuarios y proyectos

class UsuarioProyecto(Base):
    __tablename__= "usuarios_proyectos"
    
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), primary_key=True)
    proyecto_id = Column(Integer, ForeignKey("proyectos.proyecto_id"), primary_key=True)
    creado = Column(DateTime, default=datetime.now())
    
    #Relaciones 
    usuario = relationship("Usuario", back_populates="proyectos")
    proyecto = relationship("Proyecto", back_populates="usuarios")