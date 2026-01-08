#Crea los tokens para validar cada usuario
from datetime import datetime, timedelta
from jose import jwt, JWTError

SECRET_KEY = "tASKFLOW_SECRET"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

#Crear Token
def create_access_token(user_id: int):
    payload = {
        "sub": str(user_id),
        "exp": datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

#Decodificar Token
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None