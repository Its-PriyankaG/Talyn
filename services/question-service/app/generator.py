import os
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

DEPLOYMENT_NAME = "Resume_Extractor"

def generate_questions(role: str, anonymized_resume: str, github_signal: list):

    github_context = ""
    if github_signal:
        github_context = "Candidate GitHub projects:\n"
        for repo in github_signal:
            github_context += f"- {repo['name']} ({repo['language']}): {repo['description']}\n"

    prompt = f"""
You are an AI interviewer.

Role: {role}

Candidate background (anonymized):
{anonymized_resume}

{github_context}

Generate 10 to 15 practical, problem-solving interview questions.
Rules:
- At least 3 to 5 questions must probe decisions made in the GitHub projects
- Avoid textbook questions
- Focus on tradeoffs, debugging, and real-world reasoning

For each question, include:
- question
- rationale

Return output as JSON list.
"""


    response = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {"role": "system", "content": "You generate interview questions."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4
    )

    return response.choices[0].message.content
