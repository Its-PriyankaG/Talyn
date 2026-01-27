import os
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-02-01",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

MODEL_NAME = "Resume_Extractor"

def extract_resume(resume_text: str) -> str:
    prompt = f"""
Extract the candidate's skills, experience, projects, and technologies
from the resume below. Do not include name, gender, email, phone number,
or any personal identifiers.

Resume:
{resume_text}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a resume analysis engine."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content
