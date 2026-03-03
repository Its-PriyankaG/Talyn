from pydantic import BaseModel, EmailStr
from typing import Optional

class SessionCreateRequest(BaseModel):
    verification_id: str
    display_name: str
    email: EmailStr
    role: Optional[str] = None