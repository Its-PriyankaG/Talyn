from fastapi import APIRouter
from datetime import datetime
import uuid

from .db import db
from .schemas import CreateSessionRequest

router = APIRouter(prefix="/session", tags=["session"])

@router.post("/create")
def create_session(payload: CreateSessionRequest):
    session_id = str(uuid.uuid4())

    session_doc = {
        "_id": session_id,
        "role": payload.role,
        "status": "created",
        "created_at": datetime.utcnow()
    }

    db.sessions.insert_one(session_doc)

    return {
        "session_id": session_id,
        "role": payload.role,
        "status": "created"
    }
