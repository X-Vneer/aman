# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — production build to `dist/`.
- `npm run typecheck` — `tsc -b` (project references). Run after non-trivial changes; there is no test suite.
- `npm run lint` — ESLint over the repo.
- `npm run preview` — preview the built bundle.

There is no test runner, no Storybook, no `format` script. Prettier runs through the editor / pre-commit only.

## Stack

- **Vite 8 + React 19 + TS 6** with `@vitejs/plugin-react-swc`. Path aliases: `@/* → src/*`, `@components/* → src/components/*`, `@assets/* → src/assets/*`.
- **UI:** Mantine 9 (`@mantine/core`, `dates`, `charts`, `dropzone`, `tiptap`, `notifications`, `modals`, `form`) + Tailwind 4. The Mantine theme in `src/lib/mantine/theme.ts` overrides defaults for `Table*`, `Input`, `Select`, `Button`, `Calendar`, `SegmentedControl`, etc. — prefer Mantine primitives so styling stays consistent. Tailwind is loaded via PostCSS (`@tailwindcss/postcss`), no `tailwind.config.*`.
- **Server state:** TanStack Query (single global `QueryClient` in `src/App.tsx`).
- **URL state:** `nuqs` with the `react-router/v7` adapter. Read params with `useOptimisticSearchParams()`; write with `useQueryState` / `useQueryStates`.
- **Forms:** `react-hook-form` + `zod` schemas in `src/validation/`. Mantine forms in some places (note: this codebase migrated to Mantine 9 / `schemaResolver` — see `docs/guides-8x-to-9x.md`).
- **i18n:** `i18next` + `react-i18next`. Translations are bundled JSON: `src/content/{ar,en}.json` (no `public/locales`). Language is detected from the URL path (`detection.order: ["path"]`).

## App Architecture

### Routing & locale prefix

`src/router.tsx` uses React Router 7 with a top-level `/:locale?/...` segment. Two layouts: `auth/layout` and `dashboard/layout`. Most routes are `React.lazy`-loaded.

**Always import `Link`, `NavLink`, `Navigate`, `useNavigate`, `useParams`, `usePathname` from `@/lib/i18n/navigation` — not from `react-router-dom`.** These wrappers prepend the active `:locale` to every `to`/path so navigation stays inside the locale subtree. Direct use of `react-router-dom`'s exports drops the prefix and breaks i18n.

### App segments (Next-style folders)

`src/app/<segment>/page.tsx` is the route component. Each domain folder (`blogs`, `users`, `programs`, `partners`, `awareness`, `stories`, `contacts`, `permissions`, `reviews`, `certificates`, `reports`) colocates:

- `page.tsx` — toolbar (search/filters/active chips/export) + table or detail view.
- `get-*.ts` / `create-*.ts` / `update-*.ts` / `delete-*.ts` — service functions calling the Axios client.
- `types.ts` — response/entity types.
- `components/table.tsx`, `components/<entity>-form.tsx`, etc.
- Subroutes use Next-style folder names: `[id]/page.tsx`, `add/page.tsx`, e.g. `programs/[id]/scenes/[sceneId]/page.tsx`.

### API client

`src/services/aman.ts` exports two Axios instances:

- `AmanApi` (default export) — base `${baseURL}/admin`, attaches `Authorization: Bearer <token>` from localStorage and `Accept-language` from i18next, auto-`logout()` on `401`.
- `AmanApiGuest` — base `${baseURL}/guest/admin`, no auth.

Base URL is `VITE_LOCAL_API_BASE_URL` (dev only, from `.env`). Trailing slash stripped.

The request interceptor converts `URLSearchParams` to a plain object and splits any `key[]=a,b,c` value into `key: ["a","b","c"]`. **When passing filter state to a service, prefer passing the `URLSearchParams` from `useOptimisticSearchParams()` directly** (see `GetBlogs(searchParams)` in `src/app/dashboard/blogs/get-blogs.ts`); the interceptor handles array unwrapping.

### Auth & session

- Session lives in `localStorage` under `LOCALSTORAGE_SESSION_KEY = "aman-dashboard-user"` as `{ token, item: User }`.
- `getSession()` zod-parses it; `isAuthenticated()` checks token presence; `logout()` clears + redirects.
- `DashboardLayout` mounts `<ProtectedRoute />` and re-validates the admin via `GET /admins/:id` on every mount.
- `usePermissions()` returns `hasPermissionsTo(action)`. Action keys are the union in `src/app/dashboard/permissions/type.ts` (`PermissionPaths`, e.g. `"Coupon:Add"`, `"User:Edit"`). Gate buttons/menus on this.

### Tables: sort + refresh + filters

Pattern documented in `docs/developer-guide.md`; reference implementation in `src/app/dashboard/blogs/components/table.tsx`.

- URL is the source of truth: `useOptimisticSearchParams()` → query key includes `searchParams.toString()` → TanStack Query refetches automatically when any URL param changes.
- Sort: declare `const SORTABLE: Record<string, string> = { col: "api_col" }` and use `<SortableTh>` (3-state cycle ASC → DESC → off, via `useSortParams`). Backend allow-list is the model's `$fillable` minus `$excludedColumns` — translatable JSON columns (e.g. blog `title`) and computed/JOIN columns are not sortable.
- `<RefreshButton refetch={refetch} isFetching={isFetching} />` next to `<TableTotalCount>` for manual reload without resetting URL params.
- Active filter chips: pick the matching hook from `src/hooks/use-dashboard-active-filter-chips.ts` (one per page) and render with `<ActiveFiltersBar chips={…} />`. Add a new hook there when introducing a new page rather than reinventing chip logic.

### Forms

- `useForm` from `react-hook-form` with a zod schema from `src/validation/`.
- On submit error: `handleFormError(error, form)` (in `src/utils/`) maps Laravel-style `{ message, errors: { field: [msg] } }` onto `form.setError`, including `root`.
- For field error display, prefer `showErrorMessage(errors, "field")`: it returns the raw message when `type === "custom"` (already-translated server message) and otherwise looks up `global.errors.<message>` in i18n. Schema messages should therefore be **i18n keys**, not human strings.
- Long multi-step forms use `useLocalFormStorage` (`src/hooks/use-local-form-storage.ts`) for debounced localStorage drafts.

## Conventions to respect

- **Prettier** (`.prettierrc`): no semicolons, double quotes, `printWidth: 110`, `bracketSameLine: true`.
- **ESLint** disables `no-unused-vars` and `@typescript-eslint/no-unused-vars`; `tsconfig` also has `noUnusedLocals/Parameters: false`. Don't spend effort removing unused imports/vars unless they're noisy in a touched file.
- React 19 + Mantine 9 — when adding/upgrading code, follow `docs/guides-8x-to-9x.md` (`zodResolver` → `schemaResolver`, `Collapse in` → `expanded`, `Grid gutter` → `gap`, `Text color` → `c`, `useLocalStorage` value can be `undefined`, etc.).
- RTL is automatic: `App.tsx` syncs `document.documentElement.dir` from i18next; Mantine `DirectionProvider` follows. Use logical Tailwind classes (`ltr:` / `rtl:` variants exist in `index.html`) when direction-specific styling is needed.
