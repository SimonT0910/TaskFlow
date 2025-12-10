import json
import requests
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario
from pathlib import Path

router = APIRouter(prefix="/auth", tags=["Auth"])

# Cargar Client_ID y client_secret
BASE_DIR = Path(__file__).resolve().parent.parent
with open(BASE_DIR / "google_oauth_client.json", "r") as f:
    google_config = json.load(f)["web"]

CLIENT_ID = google_config["client_id"]
CLIENT_SECRET = google_config["client_secret"]
REDIRECT_URI = google_config["redirect_uris"][0]

# Ruta para iniciar sesión con Google
@router.get("/google")
def login_google():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
        "&prompt=consent"
    )
    return RedirectResponse(google_auth_url)

# Callback de Google
@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    token_url = "https://oauth2.googleapis.com/token"

    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    token_response = requests.post(token_url, data=data)
    token_json = token_response.json()

    if "access_token" not in token_json:
        raise HTTPException(status_code=400, detail=f"Google error: {token_json}")


    access_token = token_json["access_token"]

    # Obtener datos del usuario
    userinfo = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()

    email = userinfo.get("email")
    nombre = userinfo.get("given_name")
    apellido = userinfo.get("family_name")

    if not email:
        raise HTTPException(status_code=400, detail="Google no proporcionó email")

    usuario = db.query(Usuario).filter(Usuario.email == email).first()

    if not usuario:
        usuario = Usuario(
            nombre=nombre,
            apellido=apellido,
            email=email,
            contrasena="google_oauth"
        )
        db.add(usuario)
        db.commit()
        db.refresh(usuario)

    return {
        "message": "Inicio de sesión exitoso con Google",
        "usuario_id": usuario.usuario_id,
        "email": usuario.email,
        "nombre": usuario.nombre,
    }
