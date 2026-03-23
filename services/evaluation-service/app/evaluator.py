import os
import json
from openai import AzureOpenAI
from dotenv import load_dotenv

from .prompt_builder import build_prompt

load_dotenv()

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

MODEL_NAME = "Resume_Extractor"


def evaluate_candidate(responses):

    prompt = build_prompt(responses)

    response = client.chat.completions.create(

        model=MODEL_NAME,

        messages=[
            {
                "role": "system",
                "content": "You are a senior technical interviewer evaluating candidate responses."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]

    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)

    except Exception:
        return {
            "scores": {
                "technical_accuracy": 70,
                "concept_depth": 70,
                "problem_solving": 70,
                "communication": 70,
                "confidence": 70,
                "time_efficiency": 70
            },
            "comments": {
                "technical_accuracy": "Evaluation parsing failed.",
                "concept_depth": "Evaluation parsing failed.",
                "problem_solving": "Evaluation parsing failed.",
                "communication": "Evaluation parsing failed.",
                "confidence": "Evaluation parsing failed.",
                "time_efficiency": "Evaluation parsing failed."
            },
            "final_score": 70,
            "final_decision": "AVERAGE"
        }