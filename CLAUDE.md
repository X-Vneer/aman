# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is a **monorepo** with three independently-built apps that talk to one shared backend. Each app also has its own deeper `CLAUDE.md` — read the relevant one before working inside that app:

- `backend/` — Laravel (PHP) API + Vite assets. *(no per-app CLAUDE.md)*
- `dashboard/CLAUDE.md` — admin panel (Vite + React 19 + TS).
- `website/CLAUDE.md` — public site (Next.js 16).

## Running the monorepo

- `start.cmd` (Windows) / `./start.sh` (macOS/Linux) — one-shot: installs any missing deps, then starts all apps.
- `npm run dev` — starts all four processes via `concurrently`: backend API (`php artisan serve`), backend Vite, dashboard, website. No `-k`: a crashing app (e.g. an unconfigured backend) does **not** tear down the others.
- `npm run install:all` — node deps for dashboard + website + backend.
- `npm run build` — builds dashboard, then website, then backend assets.

Ports: dashboard `5173`, website `3000`, backend API `8000`.

Per-app work should be done with that app's own scripts (`npm --prefix <app> run <script>`, or `cd <app>`), not the root aggregate. There is **no shared/hoisted `node_modules`** — each app installs its own; the root `node_modules` holds only `concurrently`.

## First-run setup (backend)

The backend needs PHP tooling that is not part of `npm install` and **requires Composer**:

```bash
cd backend
composer install
# create backend/.env (there is no .env.example committed), then:
php artisan key:generate
php artisan migrate      # sqlite by default; see config/database.php
```

Until `backend/vendor` and `backend/.env` exist, `php artisan serve` fails and only the frontends run.

## The cross-app contract (most important big-picture)

All three apps share **one API** (`api.inaash.edu.sa` — the backend has not yet migrated to an `aman` domain, so URLs/names still say `inaash`). The backend groups routes by audience in `backend/bootstrap/app.php`; each frontend consumes a different prefix:

| Backend prefix | Route file          | Middleware                     | Consumed by |
|----------------|---------------------|--------------------------------|-------------|
| `guest/*`      | `routes/guest.php`  | localization + rate-limit      | both (unauthed) |
| `admin/*`      | `routes/admin.php`  | `auth:sanctum` + AdminMiddleware | **dashboard** (`AmanApi` base `…/admin`) |
| `user/*`       | `routes/user.php`   | `auth:sanctum` + UserMiddleware  | **website** (`AmanApi` authed) |
| `web.php`      | —                   | web + telescope                | Telescope, health `/up` |

Shared conventions that both frontends depend on — change the backend and you change both clients:

- **Auth:** Laravel Sanctum bearer tokens. Frontends send `Authorization: Bearer <token>`; dashboard stores it in `localStorage`, website in a native AES-encrypted httpOnly cookie (`aman_session` — see `website/src/lib/auth/`, no auth library).
- **Localization:** every request carries `Accept-language`; `ApiLocalization` middleware switches locale server-side. Translatable columns use `spatie/laravel-translatable` (stored as JSON — these columns are **not** sortable via the list endpoints).
- **Permissions:** `spatie/laravel-permission`. The dashboard gates UI on the same action keys (`usePermissions()` / `PermissionPaths`).
- **Response envelope:** `BaseApiController::sendResponse(success, data, message, errors, status)`. Errors come back as `{ message, errors: { field: [msg] } }` — both frontends' `handleFormError` map exactly this shape onto form fields. `401` returns the envelope (not a redirect); clients handle logout themselves.

## Backend (Laravel) specifics

- **No `routes/api.php`.** Routing is defined in `bootstrap/app.php` via the four route files above, not the default api/web split.
- `composer run dev` is the backend's own all-in-one runner (server + `queue:listen` + `pail` logs + vite). The monorepo `npm run dev` instead runs `php artisan serve` + vite directly.
- Tests: `php artisan test` (or `vendor/bin/phpunit`); config in `phpunit.xml`.
- Notable packages: `laravel/sanctum` (auth), `spatie/laravel-permission`, `spatie/laravel-translatable`, `maatwebsite/excel` (exports), `barryvdh/laravel-dompdf` (PDF), `bacon/bacon-qr-code` (QR), `laravel/telescope` (debug UI at `/telescope`).
- App code is organized under `backend/app/{Http,Models,Services,Jobs,Exports,Enums,Mail,Helpers}` — business logic lives in `Services`, not controllers.

## Shared frontend patterns (both dashboard & website)

The two React apps were built with the same house style; the same rules apply in each (details in their own `CLAUDE.md`):

- **Locale-aware navigation is mandatory.** Import `Link`/`useRouter`/`redirect`/`usePathname` etc. from `@/lib/i18n/navigation`, never from `react-router-dom` / `next/link` / `next/navigation` — the raw exports drop the URL locale prefix and break i18n.
- API client is `src/services/aman.ts`, exporting an authed `AmanApi` + an unauthed `AmanApiGuest`.
- Server cache: TanStack Query (singleton `QueryClient`). URL state: `nuqs`. Forms: React Hook Form + Zod (`zod@^4`).
- i18n catalogs are bundled JSON in `src/content/<locale>.json`. Both are RTL-aware (Arabic).
- Prettier in both: no semicolons, double quotes, `printWidth: 110`.

## Repo hygiene

- Each app keeps its own `.gitignore`; the root `.gitignore` only covers root-level artifacts. `node_modules`, `vendor`, `.next`, and `dist` are ignored per-app.
- `dashboard/.env` is committed (it holds only non-secret API base URLs). Real secrets belong in `*.env.local` (website) or an untracked `backend/.env`.
- No CI/CD or deployment config currently — local dev only. Deployment setup deferred until a server is provisioned.
