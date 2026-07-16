@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo   Aman monorepo - starting all dev servers
echo ============================================

REM --- root deps (concurrently) ---
if not exist "node_modules" (
  echo [setup] Installing root dependencies...
  call npm install || goto :err
)

REM --- subproject deps ---
if not exist "dashboard\node_modules" (
  echo [setup] Installing dashboard dependencies...
  call npm --prefix dashboard install || goto :err
)
if not exist "website\node_modules" (
  echo [setup] Installing website dependencies...
  call npm --prefix website install || goto :err
)
if not exist "backend\node_modules" (
  echo [setup] Installing backend node dependencies...
  call npm --prefix backend install || goto :err
)

REM --- backend PHP note ---
if not exist "backend\vendor" (
  echo [warn] backend\vendor missing - run "composer install" in backend first,
  echo [warn] then copy .env and run "php artisan key:generate". Backend API will
  echo [warn] fail to boot until that is done. Other apps will still start.
)

echo [run] Launching backend + dashboard + website...
call npm run dev
goto :eof

:err
echo.
echo [error] Setup failed. See output above.
exit /b 1
