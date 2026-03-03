Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd apps/web; npm run dev"
 
Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/session-service; uvicorn app.main:app --reload --port 8001"

Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/identity-service; uvicorn app.main:app --reload --port 8002"

Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/resume-intel-service; uvicorn app.main:app --reload --port 8003"
 
Start-Process powershell "-NoExit -Command .\venv\Scripts\activate; cd services/question-service; uvicorn app.main:app --reload --port 8004"