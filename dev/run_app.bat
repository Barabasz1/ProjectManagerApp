@echo off

call ..\venv\Scripts\activate

start cmd /k "cd ../backend && fastapi dev fastapi_main.py"

start cmd /k "cd ../frontend && npm run dev"

timeout /t 1 /nobreak > nul

start http://localhost:5173/
