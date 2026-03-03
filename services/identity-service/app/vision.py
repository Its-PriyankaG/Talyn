import os
import requests
from dotenv import load_dotenv
load_dotenv()
AZURE_FACE_ENDPOINT = os.getenv("AZURE_FACE_ENDPOINT")
AZURE_FACE_KEY = os.getenv("AZURE_FACE_KEY")

headers = {
    "Ocp-Apim-Subscription-Key": AZURE_FACE_KEY,
    "Content-Type": "application/octet-stream"
}

def detect_face(image_bytes):
    url = f"{AZURE_FACE_ENDPOINT}/face/v1.0/detect?returnFaceId=true"
    response = requests.post(url, headers=headers, data=image_bytes)
    response.raise_for_status()
    faces = response.json()
    if not faces:
        return None
    return faces[0]["faceId"]

def verify_faces(face_id1, face_id2):
    url = f"{AZURE_FACE_ENDPOINT}/face/v1.0/verify"
    body = {
        "faceId1": face_id1,
        "faceId2": face_id2
    }
    headers_json = {
        "Ocp-Apim-Subscription-Key": AZURE_FACE_KEY,
        "Content-Type": "application/json"
    }
    response = requests.post(url, headers=headers_json, json=body)
    response.raise_for_status()
    return response.json()