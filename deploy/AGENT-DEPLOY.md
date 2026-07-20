# Agent deploy runbook — port-based VPS (no domain, HTTP)

Self-contained, command-first runbook for deploying Aman on a fresh Hostinger **VPS**
(Ubuntu 24.04) with **no domain** — the three apps are served on **different ports of
the VPS hostname over plain HTTP**. This matches the current live deployment.

Follow top to bottom. Commands run as **root** in an SSH shell (or Hostinger hPanel →
VPS → Browser Terminal). Do not skip the verification step.

> This is the automated, port-based sibling of `deploy/DEPLOY.md` (which documents the
> subdomain + Let's Encrypt approach). Use **this** file when you only have the bare
> VPS hostname and want the simplest thing that works.

---

## The port model

No domain → no subdomains. Instead each app gets its own port on the one hostname,
all HTTP (nginx listens on three ports; the website is proxied to the Next.js process):

| URL | App | Served by |
|-----|-----|-----------|
| `http://<HOST>`      | website (Next.js) | nginx `:80` → Node `:3000` (systemd) |
| `http://<HOST>:8080` | backend (Laravel) | nginx `:8080` → php-fpm 8.3 |
| `http://<HOST>:8081` | dashboard (Vite)  | nginx `:8081` (static `dist/`) |

`<HOST>` is the Hostinger hostname, e.g. `srv1843351.hstgr.cloud`. The committed config
(`deploy/env/*`, `dashboard/.env`, `website/next.config.js`) is already filled in for
**`srv1843351.hstgr.cloud`**. Redeploying on that host needs no host edits; on a
different host, run the one-line rewrite in step 3.

> **HTTP is cleartext** — the admin password and every bearer token travel unencrypted.
> Fine for testing/staging. Add TLS before real users (see the last section).

---

## 0. Preconditions

- Hostinger **VPS** (not shared hosting), Ubuntu 24.04, root access.
- The git repo URL (set `REPO_URL` below).
- **Ports 80, 8080, 8081 open** in the Hostinger control-panel firewall *and* in `ufw`
  if enabled (step 9). Without this the URLs are unreachable even when nginx is up.

## 1. Set variables

```bash
export REPO_URL="https://github.com/X-Vneer/aman.git"          # <-- EDIT if different
export HOST="$(hostname -f)"                                    # e.g. srv1843351.hstgr.cloud
export DB_PASS="$(openssl rand -base64 18 | tr -d '/+=')"       # generated DB password
echo "HOST=$HOST  DB_PASS=$DB_PASS"                             # RECORD DB_PASS somewhere
```

## 2. Clone + provision

```bash
git clone "$REPO_URL" /var/www/aman
cd /var/www/aman
bash deploy/setup.sh        # PHP 8.3, Composer, Node 22, nginx, MySQL, build deps
```

## 3. (Only if HOST ≠ srv1843351.hstgr.cloud) rewrite the host

The committed config targets `srv1843351.hstgr.cloud`. If your hostname differs, rewrite
it everywhere the URL is baked — env templates, dashboard env, and the next/image allowlist:

```bash
cd /var/www/aman
grep -rl 'srv1843351.hstgr.cloud' deploy/env dashboard/.env website/next.config.js \
  | xargs sed -i "s/srv1843351.hstgr.cloud/${HOST}/g"
```

## 4. MySQL (non-interactive)

Fresh Ubuntu MySQL lets root in via auth_socket, so no password prompt:

```bash
mysql <<SQL
CREATE DATABASE IF NOT EXISTS aman CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'aman'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON aman.* TO 'aman'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL
```

## 5. Environment files + secrets

The templates already carry the correct `http://<HOST>:8080` API URL, `:80` site URL,
and ports. You only fill the secrets:

```bash
cd /var/www/aman
cp deploy/env/backend.env.example   backend/.env
cp deploy/env/dashboard.env.example dashboard/.env
cp deploy/env/website.env.example   website/.env.local

# backend: DB password + app key
sed -i "s/CHANGE_ME_STRONG/${DB_PASS}/" backend/.env
php backend/artisan key:generate --force   # writes APP_KEY into backend/.env

# website: session-cookie encryption key (AES-256-GCM)
sed -i "s|CHANGE_ME|$(openssl rand -base64 32 | sed 's/[&/|]/\\&/g')|" website/.env.local

# sanity check — no placeholders left
grep -Rn 'CHANGE_ME' backend/.env website/.env.local || echo "OK: clean"
```

> **Email (optional):** to send OTP/reset mail, set `MAIL_USERNAME` + a Gmail App
> Password in `MAIL_PASSWORD` and `MAIL_FROM_ADDRESS` in `backend/.env`. Left as
> placeholders, mail just fails silently — login still works (admin = email+password,
> website user = mobile-only, neither needs email to sign in).

## 6. next/image allowlist (already set)

`website/next.config.js` already whitelists `http://<HOST>:8080` for `next/image`
(step 3 rewrites it if your host differs). No action needed — just don't remove it,
or course/certificate images 400.

## 7. systemd services (install BEFORE first build so deploy.sh can restart them)

```bash
cp /var/www/aman/deploy/systemd/aman-queue.service   /etc/systemd/system/
cp /var/www/aman/deploy/systemd/aman-website.service /etc/systemd/system/   # runs Next on :3000
systemctl daemon-reload
systemctl enable aman-queue aman-website     # started by the build below
```

## 8. Build + migrate

```bash
cd /var/www/aman
bash deploy/deploy.sh    # composer, migrate --force, config:cache, build dashboard + website, restart services
```

First run, if the DB needs seed data (admin user, permissions):

```bash
php /var/www/aman/backend/artisan db:seed --force
```

## 9. nginx — three port listeners

Write the three server blocks (all `server_name _` — one hostname, distinguished by port):

```bash
# API (Laravel) on :8080
cat > /etc/nginx/sites-available/aman-api.conf <<'NGINX'
server {
    listen 8080;
    server_name _;
    root /var/www/aman/backend/public;
    index index.php;
    charset utf-8;
    client_max_body_size 50M;
    location / { try_files $uri $uri/ /index.php?$query_string; }
    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }
    error_page 404 /index.php;
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
    location ~ /\.(?!well-known).* { deny all; }
}
NGINX

# Dashboard (static Vite dist) on :8081
cat > /etc/nginx/sites-available/aman-admin.conf <<'NGINX'
server {
    listen 8081;
    server_name _;
    root /var/www/aman/dashboard/dist;
    index index.html;
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    location / { try_files $uri $uri/ /index.html; }
}
NGINX

# Website (Next.js) on :80 -> Node :3000
cat > /etc/nginx/sites-available/aman-www.conf <<'NGINX'
server {
    listen 80 default_server;
    server_name _;
    client_max_body_size 25M;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/aman-api.conf   /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/aman-admin.conf /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/aman-www.conf   /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 10. Open the firewall

```bash
# ufw (if active)
ufw allow 80/tcp; ufw allow 8080/tcp; ufw allow 8081/tcp
```
**Also** open 80, 8080, 8081 in the Hostinger panel firewall (hPanel → VPS → Firewall) —
the cloud firewall sits in front of the VPS and blocks these ports by default.

## 11. Verify (all must pass)

```bash
curl -fsS  "http://${HOST}:8080/up"        && echo "  <- backend OK"
curl -fsSI "http://${HOST}:8081/" | head -1   # 200 -> dashboard OK
curl -fsSI "http://${HOST}/"      | head -1   # 200 -> website OK
systemctl is-active aman-website aman-queue nginx mysql
```

Report the URLs:
- Website:   `http://<HOST>`
- Dashboard: `http://<HOST>:8081`
- API health:`http://<HOST>:8080/up`

---

## Redeploy (after a git push)

```bash
cd /var/www/aman && bash deploy/deploy.sh
```
Rebuilds all three (frontend env is baked at build — a restart alone is not enough) and
restarts services.

## If something breaks

- `journalctl -u aman-website -f` — website won't boot (usually a build/env error).
- `journalctl -u aman-queue -f` — queue worker.
- `tail -f /var/www/aman/backend/storage/logs/laravel.log` — API 500s.
- **Website login doesn't stick** → the session cookie needs `NEXT_PUBLIC_SITE_URL` to be
  `http://…` (not https) so the cookie isn't marked Secure and dropped over HTTP. It's set
  in `website/.env.local`; fix and rebuild.
- **Course/cert images 400** → `website/next.config.js` must whitelist `http://<HOST>:8080`,
  and `AMAN_API` in `backend/.env` must be `http://<HOST>:8080/`. Rebuild after changing.
- 500 "permission denied" on cache/logs → re-run:
  `chown -R www-data:www-data /var/www/aman/backend/storage /var/www/aman/backend/bootstrap/cache /var/www/aman/website/.next`
- URL/host changed → it's baked into the frontend builds; **rebuild** (`deploy.sh`).

## Adding HTTPS later (recommended before real users)

Ports + HTTP are the quick path; TLS is the right end state. Two options:

1. **Get a domain** and follow `deploy/DEPLOY.md` (subdomains + certbot). Cleanest.
2. **Keep the ports, add a cert** for the hostname (e.g. via certbot standalone or a
   reverse proxy like Caddy). Then, in `website/.env.local`, set
   `NEXT_PUBLIC_SITE_URL=https://<HOST>` and **rebuild** — the session cookie's Secure
   flag re-enables automatically (it's derived from the site scheme).

## Notes for a browser-driven agent (Claude in Chrome)

The Chrome extension **cannot SSH**. It can only deploy by typing into Hostinger's
**web Browser Terminal** (hPanel → VPS → Terminal). Paste commands **one block at a
time** and wait for each to finish — web terminals drop fast multi-line paste. A real
SSH client is more reliable if available.
