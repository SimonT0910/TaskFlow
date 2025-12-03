# app/routers/__init__.py - VERSIÓN CORREGIDA
# Importa explícitamente cada router
from .auth import router as auth_router

# Lista de routers disponibles
__all__ = ["auth_router"]