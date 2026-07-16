# Aman

Monorepo for the Aman platform. Three apps, one repo, one run command.

| Folder       | Stack                      | Dev port (default) |
|--------------|----------------------------|--------------------|
| `backend`    | Laravel (PHP) + Vite       | 8000 (API)         |
| `dashboard`  | Vite + React + TypeScript  | 5173               |
| `website`    | Next.js                    | 3000               |

## Run everything

**Windows:**

```cmd
start.cmd
```

**macOS / Linux / WSL:**

```bash
./start.sh
```

Or, on any OS after deps are installed:

```bash
npm run dev
```

This starts, in parallel: the backend API (`php artisan serve`), the backend Vite
asset server, the dashboard dev server, and the website dev server.

## First-time setup

```bash
npm install            # root (concurrently)
npm run install:all    # dashboard + website + backend node deps
```

Backend (Laravel) also needs PHP deps and an env file — **requires Composer**:

```bash
cd backend
composer install
cp .env.example .env    # if no .env.example, create .env from your config
php artisan key:generate
```

> Until `backend/vendor` and `backend/.env` exist, the backend API will not boot.
> The dashboard and website still start independently.

## Useful scripts (root `package.json`)

| Script                | Does                                         |
|-----------------------|----------------------------------------------|
| `npm run dev`         | Start all dev servers (via `concurrently`)   |
| `npm run install:all` | Install node deps for all three apps         |
| `npm run build`       | Build dashboard, website, and backend assets |

Each app keeps its own scripts, dependencies, and `.gitignore` inside its folder.
