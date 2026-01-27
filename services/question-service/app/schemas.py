from pydantic import BaseModel
from typing import List
from pydantic import BaseModel
from typing import List, Optional, Dict

class QuestionRequest(BaseModel):
    session_id: str
    role: str
    anonymized_resume: str
    github_signal: Optional[List[Dict]] = []


class Question(BaseModel):
    question: str
    rationale: str

class QuestionResponse(BaseModel):
    session_id: str
    questions: List[Question]
