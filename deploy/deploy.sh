#!/usr/bin/env bash
# Redeploy / update all three apps after a git push.
# Run as root from the repo root:  bash deploy/deploy.sh
set -euo pipefail

APP_DIR="/var/www/aman"
cd "$APP_DIR"

echo "==> Pulling latest"
git pull --ff-only

# ---------- Backend (Laravel) ----------
echo "==> Backend: composer + migrate + cache"
cd "$APP_DIR/backend"
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
# storage/ and bootstrap/cache must stay writable by the php-fpm user
chown -R www-data:www-data storage bootstrap/cache
php artisan storage:link || true

# ---------- Dashboard (Vite static) ----------
echo "==> Dashboard: build"
cd "$APP_DIR/dashboard"
npm ci
npm run build   # reads dashboard/.env -> outputs dist/

# ---------- Website (Next.js) ----------
echo "==> Website: build"
cd "$APP_DIR/website"
npm ci
npm run build   # NEXT_PUBLIC_* baked from website/.env.local here
# next start (as www-data) writes its optimized-image cache under .next/cache
chown -R www-data:www-data "$APP_DIR/website/.next"

# ---------- Restart services ----------
echo "==> Restarting services"
systemctl restart aman-queue
systemctl restart aman-website
systemctl reload nginx

echo "Deploy complete."
