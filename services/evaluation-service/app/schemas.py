from pydantic import BaseModel

class EvaluationPayload(BaseModel):
    session_id: str
    reference_id: str