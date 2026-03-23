from fastapi import APIRouter
from datetime import datetime

from .db import db
from .schemas import ResponsePayload, CompleteInterviewPayload
from .utils import generate_reference_id


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


@router.post("/complete")
def complete_interview(payload: CompleteInterviewPayload):

    session_id = payload.session_id

    interview_doc = db.interview_sessions.find_one(
        {"session_id": session_id}
    )

    if not interview_doc:

        return {
            "status": "error",
            "message": "Interview session not found"
        }

    responses = interview_doc.get("responses", [])

    reference_id = generate_reference_id()

    db.interview_results.insert_one({

        "session_id": session_id,

        "reference_id": reference_id,

        "responses": responses,

        "created_at": datetime.utcnow(),

        "evaluation_status": "pending"

    })

    return {

        "status": "completed",

        "reference_id": reference_id

    }