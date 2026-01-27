from pydantic import BaseModel
from typing import Optional, Dict

class ResumeIngestRequest(BaseModel):
    session_id: str
    resume_text: str

class ResumeProcessedResponse(BaseModel):
    session_id: str
    anonymized_resume: str
    github_url: Optional[str]
