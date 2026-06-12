@echo off
echo ========================================
echo   TaskMatrix - Starting All Services
echo ========================================
echo.

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js: OK
echo.

echo [2/3] Starting Backend Server...
start "TaskMatrix Backend" cmd /k "cd server && npm start"
timeout /t 3 >nul
echo Backend: Started on http://localhost:5000
echo.

echo [3/3] Starting Frontend Dev Server...
start "TaskMatrix Frontend" cmd /k "cd client && npm run dev"
timeout /t 3 >nul
echo Frontend: Started on http://localhost:5173
echo.

echo ========================================
echo   All Services Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:5000/api
echo Frontend App: http://localhost:5173
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:5173

echo.
echo To stop servers: Close the terminal windows
echo or press Ctrl+C in each terminal
echo.
pause
