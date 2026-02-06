from pydantic import BaseModel

class AdminAuth(BaseModel):
    proyecto_id: int
    admin_password: str