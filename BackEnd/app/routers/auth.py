import os
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario


load_dotenv()

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")


if not CLIENT_ID or not CLIENT_SECRET or not REDIRECT_URI:
    raise RuntimeError("❌ Variables de entorno de Google NO cargadas")

router = APIRouter(prefix="/auth", tags=["Auth"])

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
        raise HTTPException(
            status_code=400,
            detail=f"Google error: {token_json}"
        )

    access_token = token_json["access_token"]

    userinfo_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    userinfo = userinfo_response.json()

    email = userinfo.get("email")
    nombre = userinfo.get("given_name")
    apellido = userinfo.get("family_name")

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Google no proporcionó email"
        )

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

    print("✅ LOGIN GOOGLE COMPLETADO")

    return {
        "message": "Inicio de sesión exitoso con Google",
        "usuario_id": usuario.usuario_id,
        "email": usuario.email,
        "nombre": usuario.nombre,
    }
