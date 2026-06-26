@echo off
setlocal

:: Resolve the project root from this batch file's location.
:: %~dp0 gives the directory where start.bat lives, with a trailing backslash.
set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

echo.
echo ========================================
echo   BuddyAI Development Launcher
echo   Root: %ROOT%
echo ========================================
echo.

:: Define service directories relative to the project root.
set "CLIENT_DIR=%ROOT%\client"
set "SERVER_DIR=%ROOT%\server"
set "NLP_DIR=%ROOT%\nlp-service"

:: --- Environment checks ---

if not exist "%CLIENT_DIR%\" (
    echo [ERROR] Frontend directory not found: %CLIENT_DIR%
    exit /b 1
)

if not exist "%SERVER_DIR%\" (
    echo [ERROR] Backend directory not found: %SERVER_DIR%
    exit /b 1
)

if not exist "%CLIENT_DIR%\package.json" (
    echo [ERROR] client/package.json is missing. Please run 'npm run setup' first.
    exit /b 1
)

if not exist "%SERVER_DIR%\package.json" (
    echo [ERROR] server/package.json is missing. Please run 'npm run setup' first.
    exit /b 1
)

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm was not found in PATH. Please install Node.js and ensure npm is available.
    exit /b 1
)

if not exist "%CLIENT_DIR%\node_modules\" (
    echo [ERROR] Client dependencies are missing. Please run 'npm run setup' first.
    exit /b 1
)

if not exist "%SERVER_DIR%\node_modules\" (
    echo [ERROR] Server dependencies are missing. Please run 'npm run setup' first.
    exit /b 1
)

:: --- Launch services in separate persistent windows ---

echo Starting services in their own command windows...
echo.

:: Backend server
start "BuddyAI Backend" cmd /k "cd /d ""%ROOT%"" && npm run dev:server"

:: Frontend client
start "BuddyAI Frontend" cmd /k "cd /d ""%ROOT%"" && npm run dev:client"

:: Optional NLP service
if exist "%NLP_DIR%\" (
    if exist "%NLP_DIR%\main.py" (
        where python >nul 2>&1
        if %ERRORLEVEL% equ 0 (
            start "BuddyAI NLP" cmd /k "cd /d ""%NLP_DIR%"" && python main.py"
        ) else (
            echo [WARN] Python was not found in PATH. Skipping the NLP service.
        )
    ) else (
        echo [WARN] NLP service entry point not found. Skipping.
    )
) else (
    echo [INFO] NLP service directory not found. Skipping.
)

echo.
echo All requested services have been launched.
echo Close each service window individually to stop it.
echo.
pause
endlocal
