@echo off
echo Starting AI Workout ^& Diet Planner...

:: Start Backend
start "Backend Server" cmd /k "python backend/app.py"

:: Start Frontend
cd frontend
start "Frontend Server" cmd /k "npm run dev"

echo Servers started!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
