@echo off
echo ========================================
echo   TaskMatrix - Full Stack Startup
echo ========================================
echo.

echo Checking if backend is already running...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Backend is already running on port 5000
    echo.
) else (
    echo [!] Backend is not running
    echo.
    echo Starting backend server...
    echo.
    echo Please open a NEW terminal window and run:
    echo   cd server
    echo   npm run dev
    echo.
    echo Then press any key to continue...
    pause >nul
)

echo Checking if frontend is already running...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Frontend is already running on port 5173
    echo.
) else (
    echo [!] Frontend is not running
    echo.
    echo Starting frontend...
    echo.
    echo Please open another NEW terminal window and run:
    echo   cd client
    echo   npm run dev
    echo.
    echo Then press any key to continue...
    pause >nul
)

echo ========================================
echo   TaskMatrix is ready!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo Health:   http://localhost:5000/health
echo.
echo To register a new account:
echo   1. Go to http://localhost:5173/register
echo   2. Fill in your details
echo   3. Password must be 8+ chars with 1 uppercase, 1 lowercase, 1 number
echo   4. Click Create Account
echo.
echo Your data will be saved to MongoDB Atlas!
echo.
pause
