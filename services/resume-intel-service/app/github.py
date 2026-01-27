import re
import requests
import os
from datetime import datetime, timedelta

GITHUB_REGEX = r"(?:https?://)?github\.com/[A-Za-z0-9_-]+"

GITHUB_API = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def extract_github_url(text: str):
    match = re.search(GITHUB_REGEX, text, re.IGNORECASE)
    if not match:
        return None

    url = match.group(0)
    if not url.startswith("http"):
        url = "https://" + url
    return url

NOISE_KEYWORDS = [
    "100-days",
    "30-days",
    "challenge",
    "daily",
    "practice",
    "leetcode",
    "hackerrank"
]

def fetch_github_signal(github_url: str, limit: int = 5):
    username = github_url.rstrip("/").split("/")[-1]

    headers = {}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    resp = requests.get(
        f"{GITHUB_API}/users/{username}/repos?per_page=100",
        headers=headers
    )

    if resp.status_code != 200:
        return []

    repos = resp.json()
    meaningful_repos = []

    for repo in repos:
        if repo.get("fork"):
            continue

        if not repo.get("language"):
            continue

        name = repo.get("name", "").lower()
        if any(keyword in name for keyword in NOISE_KEYWORDS):
            continue

        meaningful_repos.append({
            "name": repo.get("name"),
            "language": repo.get("language"),
            "description": repo.get("description"),
            "updated_at": repo.get("updated_at")
        })

    meaningful_repos.sort(
        key=lambda r: datetime.strptime(
            r["updated_at"], "%Y-%m-%dT%H:%M:%SZ"
        ),
        reverse=True
    )

    return meaningful_repos[:limit]


