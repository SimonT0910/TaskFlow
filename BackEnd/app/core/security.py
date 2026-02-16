#Esto sirve para poder proteger con hash la contraseña del administrador
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_project_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_project_password(password: str, hash: str) -> bool:
    return pwd_context.verify(password, hash)