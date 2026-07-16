# Coupon Detail Sort Inventory — Phase A Diagnostic

Branch: `fix/coupon-detail-full-sorting`  
Date: 2026-04-23

---

## 1. Page & Component File Paths

| Item | Path |
|---|---|
| Page component | `src/app/dashboard/coupons/[id]/page.tsx` |
| Inner usage table | `src/app/dashboard/coupons/[id]/components/table.tsx` |
| API fetcher | `src/app/dashboard/coupons/[id]/get-users.ts` |
| TypeScript types | `src/app/dashboard/coupons/[id]/types.ts` |

The page renders two distinct visual sections: a statistics/chart block (untouched) and a single usage table (`<UsersTable />`). There is only one inner table on this page — no prefix collision risk.

---

## 2. Endpoint

```
GET /admin/coupons/{id}/users
```

Route declaration (`routes/admin.php` line 135):
```php
Route::get('coupons/{coupon}/users', [CouponController::class, 'couponUsers'])
```

---

## 3. Controller & Method

```
App\Http\Controllers\Admin\CouponController::couponUsers()
```

File: `app/Http/Controllers/Admin/CouponController.php` lines 57–113.

The method swaps the runtime model to `UserVideo` and its resource to `CouponUserVideoResource`, then calls `indexInit()`.

---

## 4. Current Allow-Listed Sort Columns

Set in `couponUsers()` immediately before `indexInit()`:
```php
$this->columns = ['price', 'discount_value', 'created_at'];
```

Combined with `id` always allowed by IndexTrait, the effective allow-list today is:
```
id, price, discount_value, created_at
```

Only `price` and `created_at` are wired in the frontend SORTABLE map. `discount_value` is in the allow-list but is not displayed as its own column or wired to a sort key.

---

## 5. Eloquent Model

**`App\Models\UserVideo`** — table `user_videos`.

Not `CouponUsage` or `CouponRedemption`. The model represents a user's enrollment in a video (program) and is re-used for coupon redemption tracking via the `coupon_id` and `coupon_code` columns.

---

## 6. Per-Column Diagnostic

### Column 1 — الاسم (User Name)

| Property | Value |
|---|---|
| React JSX | `{user.user.full_name}` |
| Data source | `users.full_name` — a **MySQL virtual generated column**: `CONCAT(first_name, " ", last_name)` (migration line 21 of `create_users_table.php`) |
| Relation path | `user_videos.user_id → users.id` (FK, no explicit index on `user_videos.user_id` beyond the FK itself; `users.id` is PK) |
| DB index on sort column | None on `users.full_name` (virtual columns cannot be indexed by default in MySQL) |
| Sort strategy | Correlated subquery: `ORDER BY (SELECT full_name FROM users WHERE users.id = user_videos.user_id LIMIT 1)` — avoids GROUP BY conflict |
| Backend sort key | `user_name` |

### Column 2 — رقم الهاتف (Phone)

| Property | Value |
|---|---|
| React JSX | `{user.user.mobile}` |
| Data source | `users.mobile` — real column |
| Relation path | `user_videos.user_id → users.id` |
| DB index | `INDEX(['mobile'])` on `users` table |
| Sort strategy | Correlated subquery: `ORDER BY (SELECT mobile FROM users WHERE users.id = user_videos.user_id LIMIT 1)` |
| Backend sort key | `user_mobile` |

### Column 3 — البرامج (Program/Video Title)

| Property | Value |
|---|---|
| React JSX | `{user.video_title}` |
| Data source | `videos.title` — **Spatie translatable JSON** column: `{"ar":"…","en":"…"}` |
| Relation path | `user_videos.video_id → videos.id` (`user_videos.video_id` has FK constraint via `->constrained('videos')`) |
| DB index | `user_videos.video_id` has a FK index; no index on `videos.title` |
| Sort strategy | Correlated subquery with `JSON_UNQUOTE(JSON_EXTRACT(..., '$.ar'))` — sorts by Arabic title (primary locale). Falls back to `null` for rows with no matching video. |
| Backend sort key | `video_title` |
| **Known issue** | `video` relation is **not eager-loaded** in the current `afterGet` callback (only `user` is loaded). This causes N+1 queries per row. **Fix: add `video` to the `load()` call.** |

### Column 4 — عدد مرات الاستخدام (Number of Times Used)

| Property | Value |
|---|---|
| React JSX | `{user.number_of_time_used}` |
| Data source | `count(coupon_code) as number_of_time_used` — DB aggregate in the GROUP BY query |
| DB index | `INDEX(['coupon_code'])` on `user_videos` — exists |
| Sort strategy | `orderByRaw("count(coupon_code) $dir")` — MySQL allows aggregate expressions in ORDER BY on GROUP BY queries |
| Backend sort key | `number_of_time_used` |

### Column 5 — إجمالي المبلغ المخصوم (Total Discount / Percentage)

| Property | Value |
|---|---|
| React JSX | `{user.percentage}` |
| Data source | PHP accessor `getPercentageAttribute()`: `number_format((int)discount_value / (int)price * 100, 2) . ' %'` |
| DB columns involved | `user_videos.discount_value` and `user_videos.price` — both in SELECT and GROUP BY |
| Sort strategy | `orderByRaw("CASE WHEN price > 0 THEN discount_value / price ELSE 0 END $dir")` — sorts by the ratio; matches accessor logic. `price` and `discount_value` are in the SELECT so they are in scope. |
| Backend sort key | `percentage` |

### Column 6 — السعر (Price)

| Property | Value |
|---|---|
| React JSX | `{user.price}` |
| Data source | `user_videos.price` — real column, in SELECT |
| DB index | None specific on `price` |
| Sort strategy | Standard `orderBy('price', $dir)` — **already in allow-list** |
| Backend sort key | `price` (already wired) |
| **Bug** | `price` is **not included** in `CouponUserVideoResource::toArray()`. The column is selected and available on the model but the resource omits it, so `user.price` is `undefined` at runtime. **Fix: add `'price' => $this->price` to the resource.** |

### Column 7 — تاريخ الاستخدام (Usage Date)

| Property | Value |
|---|---|
| React JSX | `dayjs(new Date(user.created_at)).format("DD/MM/YYYY")` |
| Data source | `user_videos.created_at` — real column, in SELECT |
| DB index | `INDEX(['created_at'])` exists |
| Sort strategy | Standard `orderBy('created_at', $dir)` — **already in allow-list** |
| Backend sort key | `created_at` (already wired as `date`) |

---

## 7. Missing Index

`user_videos.coupon_id` is declared as `$table->foreignId('coupon_id')->on('coupons')->nullable()` **without** `->constrained()`, meaning no FK constraint and no auto-created index. The primary filter on this endpoint is `WHERE coupon_id = $id`. On a large `user_videos` table this is a full-table scan.

**Action:** Add a migration creating `INDEX user_videos_coupon_id_index ON user_videos (coupon_id)`.

---

## 8. Summary of Required Changes

### Backend (`inaash-api`)

| File | Change |
|---|---|
| `CouponController::couponUsers()` | Load `video` in afterGet; add `$sortAllowed` with closures for `user_name`, `user_mobile`, `video_title`, `number_of_time_used`, `percentage` |
| `CouponUserVideoResource::toArray()` | Add `'price' => $this->price` to response |
| New migration | `ADD INDEX user_videos_coupon_id_index (coupon_id)` |

### Frontend (`inaash-dashboard`)

| File | Change |
|---|---|
| `coupons/[id]/components/table.tsx` | Expand SORTABLE map to all 7 columns using the backend sort keys above |
| `coupons/[id]/types.ts` | Add `price` field to `User` interface |
