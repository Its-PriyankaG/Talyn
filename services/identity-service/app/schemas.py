from pydantic import BaseModel

class IdentityResponse(BaseModel):
    verification_id: str
    face_match_score: float
    verified: bool