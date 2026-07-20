# Agent deploy runbook — hostname-only VPS (no domain)

Self-contained, command-first runbook for an **autonomous agent** deploying Aman on a
fresh Hostinger **VPS** (Ubuntu 24.04) when the user has **no domain** — only the VPS IP.

Follow top to bottom. Commands run as **root** in an SSH shell (or Hostinger hPanel →
VPS → Browser Terminal). Do not skip verification steps.

> This is the human guide's automated sibling. `deploy/DEPLOY.md` explains *why*; this
> file is the exact *what*. Same scripts, same nginx/systemd files — only the domain
> step differs.

---

## Why nip.io (read once)

The tested setup uses 3 subdomains (`api.` / `admin.` / `www.`). With only an IP you
can't create subdomains. **`nip.io` is free wildcard DNS**: `anything.<IP>.nip.io`
resolves to `<IP>` with zero setup, and Let's Encrypt issues real certs for it. So:

| Host | Resolves to | Serves |
|------|-------------|--------|
| `<IP>.nip.io` | your VPS | website (Next.js) |
| `api.<IP>.nip.io` | your VPS | backend (Laravel) |
| `admin.<IP>.nip.io` | your VPS | dashboard (Vite) |

Every config file uses the placeholder `example.com`. One `sed` rewrites them all to
`<IP>.nip.io`, because `api.example.com` → `api.<IP>.nip.io`, etc. **No source/routing
changes.** (Downside: depends on the third-party nip.io service — fine for
test/staging; buy a real domain for serious production and skip the sed's nip.io part.)

---

## 0. Preconditions

- Hostinger **VPS** (not shared hosting), Ubuntu 24.04, root access.
- The git repo URL (set `REPO_URL` below).
- Ports 80 + 443 open (Hostinger firewall + `ufw` if enabled).

## 1. Set variables

```bash
export REPO_URL="https://github.com/<you>/<repo>.git"   # <-- EDIT
IP="$(curl -fsS ifconfig.me)"                            # public IP, auto-detected
export BASE="${IP}.nip.io"                               # base host
export DB_PASS="$(openssl rand -base64 18 | tr -d '/+=')"  # generated DB password
echo "IP=$IP  BASE=$BASE  DB_PASS=$DB_PASS"              # RECORD DB_PASS somewhere
```

## 2. Clone + provision

```bash
git clone "$REPO_URL" /var/www/aman
cd /var/www/aman
bash deploy/setup.sh        # PHP 8.3, Composer, Node 22, nginx, MySQL, certbot, build deps
```

## 3. Rewrite the `example.com` placeholder → your host

Do this ONCE, before copying any config. Rewrites nginx confs + env templates in place.

```bash
cd /var/www/aman
grep -rl 'example.com' deploy/nginx deploy/env | xargs sed -i "s/example.com/${BASE}/g"
grep -rn "${BASE}" deploy/nginx/     # verify: server_name lines now show <IP>.nip.io
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

```bash
cd /var/www/aman
cp deploy/env/backend.env.example   backend/.env
cp deploy/env/dashboard.env.example dashboard/.env
cp deploy/env/website.env.example   website/.env.local

# backend: DB password + app key
sed -i "s/CHANGE_ME_STRONG/${DB_PASS}/" backend/.env
php backend/artisan key:generate --force   # writes APP_KEY into backend/.env

# website: session-cookie encryption key
sed -i "s|CHANGE_ME|$(openssl rand -base64 32 | sed 's/[&/|]/\\&/g')|" website/.env.local

# sanity check — no placeholders left
grep -Rn 'CHANGE_ME\|example.com' backend/.env dashboard/.env website/.env.local || echo "OK: clean"
```

## 6. Whitelist the API host for next/image

`next/image` blocks non-whitelisted hosts. Add the prod API origin to
`website/next.config.js` `images.remotePatterns` (leave the existing entries):

```bash
cd /var/www/aman
node -e '
const f="website/next.config.js"; const fs=require("fs");
let s=fs.readFileSync(f,"utf8");
const add=`new URL("https://api.${process.env.BASE}/**"), `;
if(!s.includes(process.env.BASE)) s=s.replace("remotePatterns: [", "remotePatterns: ["+add);
fs.writeFileSync(f,s);
'
grep -n "$BASE" website/next.config.js   # verify the new remotePattern is present
```

## 7. systemd services (install BEFORE first build so deploy.sh can restart them)

```bash
cp /var/www/aman/deploy/systemd/aman-queue.service   /etc/systemd/system/
cp /var/www/aman/deploy/systemd/aman-website.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable aman-queue aman-website     # started after the first build below
```

## 8. Build + migrate

```bash
cd /var/www/aman
bash deploy/deploy.sh    # composer, migrate --force, build dashboard + website, restart services
```

If this is the first run and the DB needs seed data (admin user, permissions):

```bash
php /var/www/aman/backend/artisan db:seed --force
```

## 9. nginx

```bash
cp /var/www/aman/deploy/nginx/api.conf   /etc/nginx/sites-available/
cp /var/www/aman/deploy/nginx/admin.conf /etc/nginx/sites-available/
cp /var/www/aman/deploy/nginx/www.conf   /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/api.conf   /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/admin.conf /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/www.conf   /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 10. SSL (Let's Encrypt)

```bash
certbot --nginx --non-interactive --agree-tos -m "admin@${BASE}" \
  -d "api.${BASE}" -d "admin.${BASE}" -d "${BASE}" -d "www.${BASE}"
```

certbot rewrites the `:80` blocks to add `:443` + auto-renew. If it fails, confirm
port 80 is reachable and DNS resolves: `getent hosts api.${BASE}`.

## 11. Verify (all must pass)

```bash
curl -fsS "https://api.${BASE}/up"           && echo "  <- backend OK"
curl -fsSI "https://admin.${BASE}/"  | head -1   # 200 -> dashboard OK
curl -fsSI "https://${BASE}/"        | head -1   # 200 -> website OK
systemctl is-active aman-website aman-queue nginx mysql
```

Report the three URLs to the user:
- Website:  `https://<IP>.nip.io`
- Dashboard: `https://admin.<IP>.nip.io`
- API health: `https://api.<IP>.nip.io/up`

---

## Redeploy (after a git push)

```bash
cd /var/www/aman && bash deploy/deploy.sh
```

## If something breaks

- `journalctl -u aman-website -f` — website won't boot (usually a build/env error).
- `journalctl -u aman-queue -f` — queue worker.
- `tail -f /var/www/aman/backend/storage/logs/laravel.log` — API 500s.
- 500 "permission denied" on cache/logs → re-run:
  `chown -R www-data:www-data /var/www/aman/backend/storage /var/www/aman/backend/bootstrap/cache /var/www/aman/website/.next`
- Changed a domain/host later → it's baked into the frontend builds; **rebuild**
  (`deploy.sh`), a restart is not enough.

## Notes for a browser-driven agent (Claude in Chrome)

The Chrome extension **cannot SSH**. It can only deploy by typing into Hostinger's
**web Browser Terminal** (hPanel → VPS → Terminal). Paste commands **one block at a
time** and wait for each to finish — web terminals drop fast multi-line paste. A real
SSH client is more reliable if available.
