import json
import requests
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario
from pathlib import Path

router = APIRouter(prefix="/auth", tags=["Auth"])

#Cargar Client_ID y secret

BASE_DIR = Path(__file__).resolve().parent
with open(BASE_DIR / "google_oauth_client.json", "r") as f:
    google_config = json.load(f)["web"]
    
CLIENT_ID = google_config["client_id"]
CLIENT_SECRET = google_config["client_secret"]
REDIRECT_URI = google_config["redirect_uris"][0] #Redirecciona a la aplicacion

#Ruta para el inicio de sesion

@router.get("/google")
def login_google():
    #Esta ruta redirige al usuario a Google para iniciar sesion
    
    google_auth_url = ("https://accounts.google.com/o/oauth2/v2/auth"
        "?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
        "&prompt=consent")
    return RedirectResponse(google_auth_url)

#Callback de Google

@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    #Google redirige aqui despues del login. Recibimos el 'code', pedimos el token y obtenemos la infomracion del usuario
    
    #1. Intercambiar el 'code' por un token de acceso
    token_url = "https://oauth2.googleapis.com/token"
    
    data = {"code": code, "client_id": CLIENT_ID, "client_secret": CLIENT_SECRET, "redirect_uri": REDIRECT_URI, "grant_type": "authorization_code",}
    
    token_response = requests.post(token_url, data=data)
    token_json = token_response.json()
    
    if "access_token" not in token_json:
        raise HTTPException(status_code=400, detail="Error de Google")
    
    acces_token = token_json["acces_token"]
    
    #2. Obtener informacion del usuario desde Google
    userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    userinfo = requests.get(userinfo:url, headers=headers).json()
    
    email = userinfo.get("email")
    nombre = userinfo.get("given_name")
    apellido = userinfo.get("family_name")
    
    if not email:
        raise HTTPException(status_code=400, detail="No se pudo obtener correo del usuario")
    
    #3. Verificar si el usuario ya existe en SQL Server
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    
    #Si no existe, se crea
    if not usuario:
        usuario = Usuario(nombre=nombre,
                          apellido=apellido,
                          email=email,
                          contrasena="google_login")
        db.add(usuario)
        db.commit()
        db.refresh(usuario)
        
    #4. Redirigir al frontend
    return{
        "Message": "Inicio de sesion exitoso con Google",
        "usuario_id": usuario.usuario_id,
        "email": usuario.email,
        "nombre": usuario.nombre 
    } 