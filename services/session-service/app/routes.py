from fastapi import APIRouter
from datetime import datetime
import uuid

from .db import db
from .schemas import SessionCreateRequest

router = APIRouter(prefix="/session", tags=["session"])

@router.post("/create")
def create_session(payload: SessionCreateRequest):
    session_id = str(uuid.uuid4())

    session_doc = {
        "_id": session_id,
        "session_id": session_id,
        "verification_id": payload.verification_id,
        "display_name": payload.display_name,
        "email": payload.email,
        "role": payload.role,  # will be None initially
        "status": "contact_collected",
        "created_at": datetime.utcnow()
    }

    db.sessions.insert_one(session_doc)

    return {
        "session_id": session_id,
        "status": "contact_collected"
    }