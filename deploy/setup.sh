#!/usr/bin/env bash
# One-time server provisioning for a fresh Hostinger Ubuntu 24.04 VPS.
# Run as root:  bash deploy/setup.sh
# Idempotent-ish: safe to re-run; it will just report "already installed".
set -euo pipefail

echo "==> Updating base system"
apt-get update -y
apt-get install -y software-properties-common curl git unzip ca-certificates gnupg lsb-release

echo "==> PHP 8.3 (via ondrej/php for reliable extensions)"
add-apt-repository -y ppa:ondrej/php
apt-get update -y
apt-get install -y \
  php8.3-fpm php8.3-cli php8.3-mysql php8.3-mbstring php8.3-xml \
  php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl php8.3-gmp

echo "==> Composer"
if ! command -v composer >/dev/null 2>&1; then
  curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi

echo "==> Node.js 22 LTS (NodeSource)"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "==> Native build deps for node-canvas + sharp (website)"
apt-get install -y build-essential pkg-config \
  libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

echo "==> nginx"
apt-get install -y nginx

echo "==> MySQL server"
apt-get install -y mysql-server

echo "==> certbot (Let's Encrypt via nginx plugin)"
apt-get install -y certbot python3-certbot-nginx

echo
echo "Provisioning done."
echo "Next: secure MySQL ->  mysql_secure_installation"
echo "Then create the app database (see DEPLOY.md step 2)."
