from fastapi import FastAPI
from dotenv import load_dotenv
from .routes import router

load_dotenv()

app = FastAPI(title="Talyn Session Service")

app.include_router(router)
