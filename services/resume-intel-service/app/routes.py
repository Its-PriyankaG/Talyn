from fastapi import APIRouter, UploadFile, File, Form
import tempfile
import os
import requests
from .db import db
from .pdf_reader import extract_text_from_pdf
from .extractor import extract_resume
from .anonymizer import anonymize
from .github import extract_github_url, fetch_github_signal

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/ingest")
def ingest_resume(
    session_id: str = Form(...),
    resume_pdf: UploadFile = File(...)
):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(resume_pdf.file.read())
        temp_path = tmp.name

    try:
        resume_text = extract_text_from_pdf(temp_path)
        extracted = extract_resume(resume_text)

        anonymized = anonymize(extracted)

        github_url = extract_github_url(resume_text)
        github_signal = []

        if github_url:
            github_signal = fetch_github_signal(github_url)

        db.resumes.insert_one({
            "session_id": session_id,
            "raw_text": resume_text,
            "anonymized_text": anonymized,
            "github_url": github_url,
            "github_signal": github_signal
        })

        requests.post(
            "http://localhost:8004/questions/generate",
            json={
                "session_id": session_id,
                "role": "Backend Intern",
                "anonymized_resume": anonymized,
                "github_signal": github_signal
            }
        )

        return {
            "session_id": session_id,
            "anonymized_resume": anonymized,
            "github_url": github_url,
            "github_signal": github_signal
        }


    finally:
        os.remove(temp_path)
