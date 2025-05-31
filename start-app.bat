@echo off
echo Starting E-Commerce Website Application...

start cmd /k "cd Backend && npm run dev"
timeout /t 5 > nul
start cmd /k "cd Frontend && npm run dev"

echo Application started successfully!
echo Backend running at http://localhost:5000
echo Frontend running at http://localhost:5173
