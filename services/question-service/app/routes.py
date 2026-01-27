from fastapi import APIRouter
import json

from .schemas import QuestionRequest, QuestionResponse
from .generator import generate_questions
from .db import db

router = APIRouter(prefix="/questions", tags=["questions"])

@router.post("/generate", response_model=QuestionResponse)
def generate(payload: QuestionRequest):

    raw_output = generate_questions(
        payload.role,
        payload.anonymized_resume,
        payload.github_signal
    )


    questions = json.loads(raw_output)

    db.questions.insert_one({
        "session_id": payload.session_id,
        "role": payload.role,
        "questions": questions
    })

    return {
        "session_id": payload.session_id,
        "questions": questions
    }
