from pydantic import BaseModel

class AdminLogin(BaseModel):
    usuario_id: int
    contrasena: str