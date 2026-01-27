from pydantic import BaseModel

class CreateSessionRequest(BaseModel):
    role: str
