#!/usr/bin/env bash
# Aman monorepo - start all dev servers (macOS/Linux/WSL)
set -e
cd "$(dirname "$0")"

echo "============================================"
echo "  Aman monorepo - starting all dev servers"
echo "============================================"

[ -d node_modules ] || { echo "[setup] root deps..."; npm install; }
[ -d dashboard/node_modules ] || { echo "[setup] dashboard deps..."; npm --prefix dashboard install; }
[ -d website/node_modules ] || { echo "[setup] website deps..."; npm --prefix website install; }
[ -d backend/node_modules ] || { echo "[setup] backend node deps..."; npm --prefix backend install; }

if [ ! -d backend/vendor ]; then
  echo "[warn] backend/vendor missing - run 'composer install' in backend, copy .env,"
  echo "[warn] and 'php artisan key:generate' before the backend API will boot."
fi

echo "[run] Launching backend + dashboard + website..."
npm run dev
