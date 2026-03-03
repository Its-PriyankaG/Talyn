import uuid
import base64
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas import IdentityResponse
from app.vision import detect_face, verify_faces
from app.db import identity_collection

router = APIRouter()

@router.post("/identity/verify", response_model=IdentityResponse)
async def verify_identity(
    id_image: UploadFile = File(...),
    live_image: UploadFile = File(...)
):
    id_bytes = await id_image.read()
    live_bytes = await live_image.read()

    face_id_1 = detect_face(id_bytes)
    face_id_2 = detect_face(live_bytes)

    if not face_id_1 or not face_id_2:
        raise HTTPException(status_code=400, detail="Face not detected in one or both images")

    verification_result = verify_faces(face_id_1, face_id_2)
    confidence = verification_result.get("confidence", 0.0)
    verified = confidence >= 0.55

    verification_id = str(uuid.uuid4())

    identity_collection.insert_one({
        "verification_id": verification_id,
        "id_image_base64": base64.b64encode(id_bytes).decode("utf-8"),
        "live_image_base64": base64.b64encode(live_bytes).decode("utf-8"),
        "face_match_score": confidence,
        "verified": verified,
        "created_at": datetime.utcnow()
    })

    return IdentityResponse(
        verification_id=verification_id,
        face_match_score=confidence,
        verified=verified
    )