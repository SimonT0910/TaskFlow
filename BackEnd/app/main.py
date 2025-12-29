from fastapi import FastAPI
from app.routers import auth, tasks
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()  

app = FastAPI()

app.include_router(auth.router)
app.include_router(tasks.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Backend activo"}