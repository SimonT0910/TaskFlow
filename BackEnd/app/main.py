from fastapi import FastAPI
from app.routers import auth

app = FastAPI()

# Registrar el router
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Backend activo"}
