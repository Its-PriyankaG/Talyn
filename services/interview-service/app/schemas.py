from pydantic import BaseModel

class ResponsePayload(BaseModel):
    session_id: str
    question_index: int
    question: str
    transcript: str
    time_taken: int