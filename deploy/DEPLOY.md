# Deploying Aman on a single Hostinger VPS

All three apps + MySQL on one Ubuntu 24.04 VPS.

> **No domain?** See [`AGENT-DEPLOY.md`](./AGENT-DEPLOY.md) — a command-by-command
> runbook that serves the three apps on ports of the bare VPS hostname over HTTP
> (`http://<HOST>`, `:8080`, `:8081`). This is the current live setup. The subdomain +
> HTTPS guide below is the alternative once you have a domain.

| Subdomain                          | App                | Served by                          |
|------------------------------------|--------------------|------------------------------------|
| `api.aman.76.13.250.92.nip.io`     | backend (Laravel)  | nginx → php-fpm 8.3                 |
| `admin.aman.76.13.250.92.nip.io`   | dashboard (Vite)   | nginx (static `dist/`)             |
| `aman.76.13.250.92.nip.io`         | website (Next.js)  | nginx → Node (`aman-website` unit) |

Config files (`deploy/env/*`, `deploy/nginx/*`, `website/next.config.js`, `dashboard/.env`)
are already filled in for these `76.13.250.92.nip.io` hosts. Using a different IP/domain?
Rewrite it everywhere: `grep -rl '76.13.250.92' deploy website/next.config.js dashboard/.env | xargs sed -i 's/76.13.250.92/<NEW_IP>/g'`.

---

## 0. DNS

**nip.io needs no DNS records.** `*.76.13.250.92.nip.io` always resolves to `76.13.250.92` —
the IP is baked into the hostname. The only requirement: `76.13.250.92` **must be the VPS
public IP**. Confirm on the box:

```bash
curl -s ifconfig.me      # must print 76.13.250.92
```

If it prints a different IP, run the rewrite from the table above with your real IP before proceeding.

## 1. Provision the server

SSH in as root, then:

```bash
git clone <your-repo-url> /var/www/aman
cd /var/www/aman
bash deploy/setup.sh
```

Installs PHP 8.3 + extensions, Composer, Node 22, nginx, MySQL, certbot, and the
native libs `node-canvas`/`sharp` need (Cairo, Pango, vips deps).

## 2. MySQL

```bash
mysql_secure_installation      # set root password, answer Y to the hardening prompts
mysql -u root -p
```
```sql
CREATE DATABASE aman CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'aman'@'127.0.0.1' IDENTIFIED BY 'CHANGE_ME_STRONG';
GRANT ALL PRIVILEGES ON aman.* TO 'aman'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Environment files

Copy the templates and fill in real values:

```bash
cp deploy/env/backend.env.example   backend/.env
cp deploy/env/dashboard.env.example dashboard/.env
cp deploy/env/website.env.example   website/.env.local
```

Edit each: set the DB password (backend + must match step 2), the real domain,
and generate secrets:

```bash
# backend app key
cd /var/www/aman/backend && php artisan key:generate

# website session-cookie encryption key -> put into website/.env.local AUTH_SECRET
openssl rand -base64 32
```

## 4. One code edit before building the website

`next/image` only loads images from whitelisted hosts. `website/next.config.js`
`images.remotePatterns` is already set to the prod API host:

```js
remotePatterns: [
  new URL("https://api.aman.76.13.250.92.nip.io/**"),
],
```
No action unless your host differs (then rewrite per the table above). Without a matching
entry, remote images render broken in production.

## 5. Build + migrate (first deploy)

```bash
cd /var/www/aman
bash deploy/deploy.sh
```

This runs composer, `php artisan migrate --force`, builds dashboard + website,
and restarts services. On the very first run the services don't exist yet —
install them in step 6 first, or just run `deploy.sh` again after step 6.

> First-time DB: if you need seed data (e.g. the admin user / permissions),
> run `php artisan db:seed --force` in `backend/` once.

## 6. systemd services (queue worker + website)

```bash
cp deploy/systemd/aman-queue.service   /etc/systemd/system/
cp deploy/systemd/aman-website.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now aman-queue
systemctl enable --now aman-website
```

Check them:
```bash
systemctl status aman-website
journalctl -u aman-website -f      # live logs if it fails to boot
```

## 7. nginx

```bash
cp deploy/nginx/api.conf   /etc/nginx/sites-available/
cp deploy/nginx/admin.conf /etc/nginx/sites-available/
cp deploy/nginx/www.conf   /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/api.conf   /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/admin.conf /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/www.conf   /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 8. SSL (Let's Encrypt)

```bash
certbot --nginx -d aman.76.13.250.92.nip.io -d api.aman.76.13.250.92.nip.io -d admin.aman.76.13.250.92.nip.io
```
certbot rewrites the `:80` blocks to add `:443` + auto-renewal. Port **80 must be open**
(Hostinger panel + ufw) for the HTTP-01 challenge, and **443** for serving.

## 9. Done — verify

- `https://api.aman.76.13.250.92.nip.io/up` → Laravel health check returns 200.
- `https://admin.aman.76.13.250.92.nip.io` → dashboard loads, login hits the API.
- `https://aman.76.13.250.92.nip.io` → website renders.

---

## Redeploys (every update after the first)

```bash
cd /var/www/aman && bash deploy/deploy.sh
```
Pulls, rebuilds all three, re-runs migrations, restarts services.

## Gotchas / notes

- **`VITE_LOCAL_API_BASE_URL` and `NEXT_PUBLIC_*` are baked at build time.**
  Changing a domain means a rebuild, not just a service restart.
- **Uploads persist** on the VPS disk (`FILESYSTEM_DISK=local`) — no S3 needed.
  They survive redeploys since `deploy.sh` never wipes `storage/`.
- **File permissions:** `deploy.sh` chowns `backend/storage`, `backend/bootstrap/cache`,
  and `website/.next` to `www-data`. If php-fpm throws 500s about "permission denied"
  on logs/cache, re-run those chowns.
- **Telescope is disabled** in prod (`TELESCOPE_ENABLED=false`). Leave it off — it
  logs every request and exposes them at `/telescope`.
- **Backups:** dump the DB on a schedule —
  `mysqldump -u aman -p aman | gzip > /root/backups/aman-$(date +\%F).sql.gz`
  (add to root's crontab). Also back up `backend/storage/app` for uploads.
- **Mail** is `log` by default (writes to `storage/logs`). Set real SMTP in
  `backend/.env` when you want password-reset / notification emails to send.
