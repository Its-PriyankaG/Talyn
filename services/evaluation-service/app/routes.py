from fastapi import APIRouter
from .db import db
from .schemas import EvaluationPayload
from .evaluator import evaluate_candidate
from datetime import datetime

router = APIRouter(prefix="/evaluation", tags=["evaluation"])


@router.post("/run")
def run_evaluation(payload: EvaluationPayload):

    result_doc = db.interview_results.find_one(
        {"reference_id": payload.reference_id}
    )

    if not result_doc:
        return {"error": "Interview results not found"}

    session_id = result_doc.get("session_id")

    if not session_id:
        return {"error": "Session ID missing in results"}

    session_doc = db.interview_sessions.find_one(
        {"session_id": session_id}
    )

    if not session_doc:
        return {"error": "Interview session not found"}

    responses = session_doc.get("responses", [])

    if not responses:
        return {"error": "No responses found"}

    result = evaluate_candidate(responses)

    db.interview_results.update_one(
        {"reference_id": payload.reference_id},
        {
            "$set": {
                "scores": result["scores"],
                "comments": result["comments"],
                "final_score": result["final_score"],
                "final_decision": result["final_decision"],
                "evaluation_status": "completed",
                "evaluated_at": datetime.utcnow()
            }
        }
    )

    return {
        "status": "evaluation_completed",
        "reference_id": payload.reference_id
    }


@router.get("/{reference_id}")
def get_evaluation(reference_id: str):

    doc = db.interview_results.find_one(
        {"reference_id": reference_id},
        {"_id": 0}
    )

    if not doc:
        return {"error": "Evaluation not found"}

    return doc