# app/main.py - VERSIÓN SIMPLIFICADA Y SEGURA
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.Database import engine, Base, get_db
from app import schemas
from app.crud import users as crud_users

# Importar router directamente (sin __init__.py)
from app.routers.auth import router as auth_router

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaskFlow API",
    description="API para gestión de tareas con IA",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir router de autenticación
app.include_router(auth_router, prefix="/auth", tags=["Autenticación"])

# ----------------------------
# Endpoints existentes (temporal)
# ----------------------------
@app.post("/usuarios", response_model=schemas.UsuarioResponse)
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # Verificar si el email ya existe
    existe = crud_users.get_user_by_email(db, usuario.email)
    if existe:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    nuevo_usuario = crud_users.create_user(db=db, user=usuario)
    return nuevo_usuario

@app.get("/usuarios", response_model=list[schemas.UsuarioResponse])
def obtener_usuarios(db: Session = Depends(get_db)):
    return crud_users.get_all_users(db)

# ----------------------------
# Endpoints principales
# ----------------------------
@app.get("/")
def root():
    return {
        "message": "TaskFlow API funcionando correctamente 🚀",
        "docs": "/docs",
        "auth_endpoints": {
            "register": "POST /auth/register",
            "login": "POST /auth/login",
            "get_current_user": "GET /auth/me"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "taskflow-api"}