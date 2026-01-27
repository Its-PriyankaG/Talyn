from fastapi import FastAPI
from dotenv import load_dotenv
from .routes import router

load_dotenv()

app = FastAPI(title="Talyn Question Generation Service")

app.include_router(router)
