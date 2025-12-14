from fastapi import FastAPI
from app.routers import auth
from dotenv import load_dotenv

load_dotenv()  

app = FastAPI()

app.include_router(auth.router)

@app.get("/")
def root():
    return {"status": "Backend activo"}