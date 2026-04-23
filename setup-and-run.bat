@echo off
:: setup-and-run.bat
:: Script to install dependencies and run the application on Windows

echo --- RetroFront Setup ^& Run ---

:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo Installing dependencies (this may take a minute)...
    call npm install
) else (
    echo Dependencies already installed.
)

:: Run the application
echo Starting the application in development mode...
call npm run dev

pause
