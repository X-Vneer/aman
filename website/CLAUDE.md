# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server with Turbopack.
- `npm run build` — production build.
- `npm start` — run the built app.
- `npm run lint` — ESLint with `--fix`; uses the legacy config (`.eslintrc.json` via `-c`), not `eslint.config.mjs`. Both exist; the script explicitly picks the legacy one.

No test runner is configured.

`docker-compose.main.yml` / `docker-compose.uat.yml` build via the root `Dockerfile`, which installs native deps for `canvas` and `sharp` (Cairo, vips, etc.). The prod container runs with a read-only filesystem plus tmpfs mounts — don't introduce code that writes to disk at runtime.

## Repo Shape Surprises

A few things deviate from "vanilla Next.js" and will bite you if you trust conventions:

- **Middleware is `src/proxy.ts`, not `middleware.ts`.** It runs `next-intl` `createMiddleware`, matcher restricted to `/` and `/(ar|en|fr|id)/:path*`. If you add a locale, update both `src/config/index.ts` (`LOCALES`) *and* the matcher regex in `src/proxy.ts`.
- **`README.md` is the unmodified NextUI starter template**, as is the `package.json` name (`next-app-template`). Ignore them — the real stack is described below.
- **`src/lib/security/file-protection.ts` is fully commented out** but still imported at the top of `src/app/[locale]/layout.tsx`. The import is a no-op; don't chase it.
- Two ESLint configs coexist: `.eslintrc.json` (legacy, used by `npm run lint`) and `eslint.config.mjs` (flat, unused by the script). Changing lint rules requires editing both if you want parity.
- `patches/react-floater+0.9.5-5.patch` is a `patch-package` patch but there is no `postinstall` script — patches are not applied automatically on `npm install`. Either run `patch-package` manually or wire up the hook before relying on the patch.

## Architecture

### Routing & i18n

Four locales: `ar, en, fr, id` (`src/config/index.ts`). `ar` is RTL. All app routes live under `src/app/[locale]/...` with `localePrefix: "always"` — every URL has a locale segment.

Three route groups inside `[locale]`:

- `(public)` — marketing + content pages (blog, latest-news, about-us, stories, information-center, faqs, contact-us, terms, privacy-policy, certificate, start, payment, profile). `(public)/(auth)` nests login under the public chrome.
- `(video)` — the course video player at `(video)/course/[course_id]`.
- `(public)` is where most dynamic content lives; it carries the shared layout, footer, and locale-aware auth session.

A second root-level group, `src/app/(no-locale)/`, exists for pages that must *bypass* the locale prefix (`public-course`, `soon`). If you add a page here, remember the `proxy.ts` matcher will not run on it.

SEO files at app root (not locale-scoped): `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/blog/sitemap.ts`, `src/app/latest-news/sitemap.ts`. The blog/news sitemaps paginate through the API and emit `languages` alternates for every locale.

**Always import navigation from `@/lib/i18n/navigation`** (`Link`, `usePathname`, `useRouter`, `redirect`) rather than from `next/link` or `next/navigation`. These are locale-aware wrappers from `next-intl`. Using raw Next navigation drops the locale prefix and breaks i18n.

i18n message catalogs live in `src/content/<locale>.json`. The loader in `src/lib/i18n/index.ts` falls back to the default locale (`ar`) on missing-key load failures.

### Feature folder convention

Each feature under `(public)/<feature>/` typically has:

- `page.tsx` — the RSC page (usually `export const dynamic = "force-dynamic"` when it hits the API).
- `index.ts` — server-side data fetchers that call the axios client and return typed data.
- `types.ts` — API response types (hand-written from backend shapes).
- `components/` — client components for this feature only.
- `pagination-utils.ts` — when the feature paginates.

Shared UI lives in `src/components/{common,ui,icons}/`; feature-local UI stays in the feature's `components/` folder. Don't hoist feature components to `src/components` unless they're genuinely reused.

### Data layer

`src/services/aman.ts` exports two axios instances:

- `AmanApi` — authed; a request interceptor injects `Authorization: Bearer <token>` from the `next-auth` session (server-side via `auth()`, client-side via `getSession()`) and sets `Accept-language` from the current locale.
- `AmanApiGuest` — unauthed, uses `<baseURL>/guest`, only sets `Accept-language`.

Base URL is `NEXT_PUBLIC_API_URL`, defaults to `https://api.inaash.edu.sa` (backend not yet migrated). `next.config.js` whitelists the prod + UAT origins for `next/image`.

Public site URL is `SITE_URL` from `src/config/index.ts`, sourced from `NEXT_PUBLIC_SITE_URL` (empty fallback). Used by share buttons, certificate API route, and JSON-LD schemas — set it in `.env.local` when the production domain is known.

### State, forms, and query

- **Server cache**: TanStack Query (`@tanstack/react-query`) provider in `src/lib/react-query/react-query-provider.tsx`, `staleTime: 30s`, singleton `QueryClient` per browser. The provider declares `defaultError: AxiosError` globally via module augmentation — mutation/query error types are `AxiosError`, not `Error`.
- **Client state**: Zustand (e.g. `createCourseStore` in the course player).
- **Forms**: React Hook Form + Zod resolvers (`@hookform/resolvers`, `zod@^4`).
- **URL state**: `nuqs` (adapter mounted in root layout).

### Auth

`next-auth@5-beta` with a custom Credentials provider (`src/lib/auth/auth.ts`). The `authorize` callback delegates to `AmanApi.post("/guest/user/loginRegisterResendOtp", { mobile })` and returns the API user + token. JWT session strategy; the `jwt`/`session` callbacks pass the whole user through, so `session.user.token` is set via TS module augmentation inside `auth.ts`.

Don't gate pages in middleware — the project's middleware only handles locale routing. Auth-gating happens inside RSC pages via `auth()` or on the client via `useSession`.

### Styling

Tailwind v4 (PostCSS plugin), `tailwind-variants`, `tailwind-merge`, plus HeroUI v3 (the rebranded NextUI — all imports are `@heroui/*`). `next-themes` is mounted in `[locale]/providers.tsx` and the root `<html>` is hard-coded to `className="dark"` with `defaultTheme: "dark"`. Prettier is configured with `printWidth: 110`, no semicolons, double quotes, and `prettier-plugin-tailwindcss` for class sorting.
