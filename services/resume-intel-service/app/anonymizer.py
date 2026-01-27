import re

def anonymize(text: str) -> str:
    text = re.sub(r"\b(Mr|Ms|Mrs|Miss)\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\b(he|she|him|her|his|hers)\b", "", text, flags=re.IGNORECASE)
    return text.strip()
