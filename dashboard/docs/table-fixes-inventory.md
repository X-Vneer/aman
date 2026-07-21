# Table Fixes Inventory — Phase A Diagnostic

Branch: `fix/table-sort-relations-and-missing-pages`  
Date: 2026-04-23

This document records the full diagnostic for each page targeted in the second sort/refresh pass. Pages 1, 2, 5, and 7 were fully handled in the first pass and are listed here for completeness only.

---

## Page 2 — Users

| Field | Value |
|---|---|
| Dashboard file | `src/app/dashboard/users/components/table.tsx` |
| API endpoint | `GET /admin/users` |
| Controller | `App\Http\Controllers\User\UserController` |
| Model | `App\Models\User` |
| Allowed sort columns | `id`, `mobile`, `first_name`, `last_name`, `lang`, `email`, `certificate_count` |

**Status: DONE** — Fully wired in the first pass. No changes needed.

---

## Page 3 — Coupons List

| Field | Value |
|---|---|
| Dashboard file | `src/app/dashboard/coupons/components/table.tsx` |
| API endpoint | `GET /admin/coupons` |
| Controller | `App\Http\Controllers\Admin\CouponController` |
| Model | `App\Models\Coupon` |
| Excluded columns | `video_ids`, `langs`, `status` (constructor: `parent::__construct(Coupon::class, ['video_ids', 'langs', 'status'])`) |
| Current SORTABLE map | `name`, `code`, `amount`, `uses_count`, `date_start`, `date_end` |

**Issue: `status` column is not sortable**

- `status` is a MySQL virtual generated column (CASE expression: `Active` / `Inactive` / `Expired`).
- It is sortable at the DB level via `ORDER BY status`, but is excluded from the allow-list via `$excludedColumns`.
- `IndexTrait::indexInit()` only allows columns in `$this->columns` (derived from `$model->getFillable()` minus `$excludedColumns`). There is no mechanism to add extra sortable columns today.

**Root cause:** `status` excluded from `$this->columns` prevents `IndexTrait` from accepting `sort_column=status`.

**Fix required:**
- Backend: Add an `$sortAllowed` parameter to `IndexTrait::indexInit()` that lets callers whitelist extra columns (including the virtual `status`). In `CouponController::index()`, pass `['status']`.
- Frontend: Add `status: "status"` to the SORTABLE map in `coupons/components/table.tsx`.

---

## Page 4 — Coupon Detail (Inner Users Table)

| Field | Value |
|---|---|
| Dashboard file | `src/app/dashboard/coupons/[id]/components/table.tsx` |
| API endpoint | `GET /admin/coupons/{id}/users` |
| Controller | `App\Http\Controllers\Admin\CouponController::couponUsers()` |
| Model (swapped at runtime) | `App\Models\UserVideo` |

**Issue A: No sort or refresh at all**

`UsersTable` uses only static `TableTh`, no `useSortParams`, no `RefreshButton`, and the `useQuery` call does not expose `refetch` / `isFetching`.

**Issue B: URL collision with graph/detail filters**

The coupon detail page shares a single URL with graph date-range filters. If we add `sort_column` + `sort_direction` directly they will collide with any same-named params used by other components on the same route. Must use prefixed params: `users_sort_column` and `users_sort_direction`. A local `useCouponUsersSortParams` hook (or `useSortParams` extended with a prefix option) must translate these to `sort_column` / `sort_direction` before calling the API.

**Issue C: `$this->columns = []` in `couponUsers()`**

`couponUsers()` explicitly resets `$this->columns = []` at line 61. This means only `id` passes the sort allow-list check in `IndexTrait`. Sortable columns in the SELECT are `price`, `discount_value`, `created_at`. These must be explicitly set before calling `indexInit()`.

**Fix required:**
- Backend: Before the `indexInit()` call in `couponUsers()`, set `$this->columns = ['price', 'discount_value', 'created_at']`.
- Frontend: Add `useSortParams` with URL-prefixed params (`users_sort_column`, `users_sort_direction`), add `SortableTh` for `date` → `created_at` and `price` → `price`, add `RefreshButton`, transform prefixed params to standard params before passing to `GetUsers`.

**Sortable columns for this table:**

| UI Column | API `sort_column` value | Source |
|---|---|---|
| date | `created_at` | `user_videos.created_at` |
| price | `price` | `user_videos.price` |

`name`, `mobile`, `video_title`, `number_of_time_used`, `percentage` are not sortable (computed or relational).

---

## Page 5 — Contacts

| Field | Value |
|---|---|
| Dashboard file | `src/app/dashboard/contacts/components/table.tsx` |
| API endpoint | `GET /admin/contacts` |
| Controller | `App\Http\Controllers\User\ContactController` |
| Model | `App\Models\Contact` |
| Fillable (all sortable) | `type`, `name`, `email`, `mobile`, `subject`, `message`, `reply`, `video_id` |

**Status: DONE** — SortableTh and RefreshButton were added in the first pass with SORTABLE: `id`, `name`, `email`, `created_at`, `subject`. No changes needed.

---

## Page 6 — Reviews

| Field | Value |
|---|---|
| Dashboard file | `src/app/dashboard/reviews/components/table.tsx` |
| API endpoint | `GET /admin/rates` |
| Controller | `App\Http\Controllers\User\RateController` |
| Model | `App\Models\Rate` |
| Excluded columns | `rate_1`, `rate_2`, `rate_3`, `rate_4` (constructor: `parent::__construct(Rate::class, ['rate_1', 'rate_2', 'rate_3', 'rate_4'])`) |
| Allowed sort columns | `code_number`, `user_id`, `video_id`, `user_video_id`, `comment`, `deleted_at` |

**Issue: `name` column (user's full name) is not sortable**

The `name` column in the reviews table displays `review.user.full_name`, which comes from the `users` table via the `Rate::user()` relation (`hasOne` with FK `rates.user_id → users.id`). The `IndexTrait` only sorts by columns on the `rates` table. There is no JOIN mechanism.

**Root cause:** `IndexTrait::indexInit()` calls `$this->model::orderBy(...)` which operates on the `rates` table only. Sorting by `users.first_name` requires a LEFT JOIN.

**Note on video title:** `video.title` is a Spatie-translatable JSON column (`{"en":"...","ar":"..."}`). This cannot be meaningfully sorted at the DB level and must remain non-sortable.

**Fix required:**
- Backend: Extend `IndexTrait::indexInit()` with an `$sortAllowed` array that accepts callable closures. A closure receives `($query, $direction)` and is responsible for applying the join and orderBy. In `RateController::index()`, pass:
  ```php
  'sortAllowed' => [
      'user_name' => fn($q, $dir) => $q
          ->leftJoin('users', 'users.id', '=', 'rates.user_id')
          ->select('rates.*')
          ->orderBy('users.first_name', $dir),
  ]
  ```
- Frontend: Add `name: "user_name"` to the SORTABLE map in `reviews/components/table.tsx`. The `name` column header will then render as a `SortableTh`.

**Current SORTABLE map (reviews):**
```ts
const SORTABLE: Record<string, string> = {
  id: "id",
  comments: "comment",
  // name → missing (to be added)
}
```

---

## Page 7 — Stories

| Field | Value |
|---|---|
| Dashboard file | `src/app/dashboard/stories/components/table.tsx` |
| API endpoint | `GET /admin/stories` |
| Controller | `App\Http\Controllers\Admin\StoryController` |
| Model | `App\Models\Story` |
| Fillable | `first_name`, `last_name`, `title`, `mobile`, `email`, `age`, `video_id`, `locale`, `content`, `program_name` |

**Status: DONE** — Fully wired in the first pass with SORTABLE: `id`, `first_name`, `last_name`, `title`, `age`, `mobile`, `email`. No changes needed.

---

## Summary of Required Changes

### Backend (`aman-api`)

| File | Change |
|---|---|
| `app/Http/Traits/Controller/IndexTrait.php` | Add optional `$sortAllowed` parameter to `indexInit()`. Support string values (extra column names) and callable closures (custom JOIN sorts). |
| `app/Http/Controllers/Admin/CouponController.php` | (a) `index()`: pass `['status']` to `$sortAllowed`. (b) `couponUsers()`: set `$this->columns = ['price', 'discount_value', 'created_at']` before `indexInit()`. |
| `app/Http/Controllers/User/RateController.php` | `index()`: pass `$sortAllowed` closure for `user_name` → LEFT JOIN on `users`. |

### Frontend (`aman-dashboard`)

| File | Change |
|---|---|
| `src/app/dashboard/coupons/components/table.tsx` | Add `status: "status"` to SORTABLE map. |
| `src/app/dashboard/reviews/components/table.tsx` | Add `name: "user_name"` to SORTABLE map. |
| `src/app/dashboard/coupons/[id]/components/table.tsx` | Full wiring: `useSortParams` with `users_` prefix, `SortableTh` for `date`/`price`, `RefreshButton`, param transform before API call. |
