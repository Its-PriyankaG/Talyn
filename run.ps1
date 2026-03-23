# Frontend
Start-Process powershell "-NoExit -Command cd apps/web; npm run dev"


# Backend Services
Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/session-service; uvicorn app.main:app --reload --port 8001"

Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/identity-service; uvicorn app.main:app --reload --port 8002"

Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/resume-intel-service; uvicorn app.main:app --reload --port 8003"

Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/question-service; uvicorn app.main:app --reload --port 8004"

Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/interview-service; uvicorn app.main:app --reload --port 8005"

Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/evaluation-service; uvicorn app.main:app --reload --port 8006"