from fastapi import APIRouter
from datetime import datetime
from .db import db
from .schemas import ResponsePayload

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/response")
def save_response(payload: ResponsePayload):

    db.interview_sessions.update_one(
        {"session_id": payload.session_id},
        {
            "$push": {
                "responses": {
                    "question_index": payload.question_index,
                    "question": payload.question,
                    "transcript": payload.transcript,
                    "time_taken": payload.time_taken,
                    "submitted_at": datetime.utcnow()
                }
            },
            "$setOnInsert": {
                "session_id": payload.session_id,
                "created_at": datetime.utcnow()
            }
        },
        upsert=True
    )

    return {"status": "saved"}