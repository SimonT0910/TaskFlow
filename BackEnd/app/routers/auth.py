import os
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario


load_dotenv()

#Variables de entorno Google
CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

#Variables de entorno Github
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")


if not CLIENT_ID or not CLIENT_SECRET or not REDIRECT_URI:
    raise RuntimeError("Variables de entorno de Google NO cargadas")

if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET or not GITHUB_REDIRECT_URI:
    raise RuntimeError("Variables de entorno de GitHub NO cargadas")

router = APIRouter(prefix="/auth", tags=["Auth"])

#Redireccion de cuenta de Google
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

#Redireccion de cuenta de GitHub
@router.get("/github")
def login_github():
    github_auth_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={GITHUB_REDIRECT_URI}"
        "&scope=user:email"
    )
    
    return RedirectResponse(github_auth_url)

#Llamado cuenta de Google
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

    print("LOGIN GOOGLE COMPLETADO")

    return {
        "message": "Inicio de sesión exitoso con Google",
        "usuario_id": usuario.usuario_id,
        "email": usuario.email,
        "nombre": usuario.nombre,
    }
    
#Llamado cuenta de GitHub
@router.get("/github/callback")
def github_callback(code: str, db: Session = Depends(get_db)):
    token_response = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": GITHUB_REDIRECT_URI,
        },
    ).json()
    
    access_token = token_response.get("access_token")
    
    if not access_token:
        raise HTTPException(status_code=400, detail="GitHub no devolvió token")
    
    user_response = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()
    
    emails_response = requests.get(
        "https://api.github.com/user/emails",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()
    
    email = next((e["email"] for e in emails_response if e["primary"]), None)
    
    if not email:
        raise HTTPException(status_code=400, detail="GitHub no devolvió email")
    
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    
    if not usuario:
        usuario = Usuario(
            nombre=user_response.get("login"),
            apellido="GitHub",
            email=email,
            contrasena="github_oauth"
        )
        db.add(usuario)
        db.commit()
        db.refresh(usuario)
        
    print("LOGIN GITHUB COMPLETADO")
    
    return {
        "message": "Inicio de sesión exitoso con GitHub",
        "usuario_id": usuario.usuario_id,
        "email": usuario.email,
        "nombre": usuario.nombre,
    }