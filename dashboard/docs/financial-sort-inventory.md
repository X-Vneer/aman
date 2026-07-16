# Financial Table Sort Inventory — Phase A Diagnostic

Branch: `fix/financial-table-full-sorting`  
Date: 2026-04-23

---

## 1. File Paths

| Item | Path |
|---|---|
| Page component | `src/app/dashboard/financial/page.tsx` |
| Table component | `src/app/dashboard/financial/components/table.tsx` |
| Table wrapper (filters + export) | `src/app/dashboard/financial/components/users-info.tsx` |
| API fetcher | `src/app/dashboard/financial/get-financial.ts` |
| TypeScript types | `src/app/dashboard/types.ts` (shared: `UserInfo`, `Transaction`, `UsersInfoResponse`) |

---

## 2. Endpoint

```
GET /financial-management/user-information
```

Route (`routes/admin.php` line 55):
```php
Route::get('financial-management/user-information', [FinancialManagementController::class, 'userInformation'])
```

The export button in `users-info.tsx` calls the same `GetUsersInfo` function with the current `URLSearchParams`, so appending `export=true` hits the same endpoint. Sort params will flow to export automatically once the backend applies them.

---

## 3. Controller & Method

```
App\Http\Controllers\Admin\FinancialManagementController::userInformation()
```

File: `app/Http/Controllers/Admin/FinancialManagementController.php` lines 118–251.

**Key structure:** The constructor initialises `$this->model = UserVideo::class`. Inside `userInformation()`, the model is swapped to `User::class` (`$this->model = User::class`), then the callback performs:
- `RIGHT JOIN user_videos ON user_videos.user_id = users.id`
- `RIGHT JOIN videos ON videos.id = user_videos.video_id`
- `LEFT JOIN transactions ON transactions.id = user_videos.transaction_id`
- Qualified `SELECT` with all needed columns
- All search, filter, and date logic
- **Line 244: `$items = $items->orderBy('user_videos.id', 'DESC')`** — hardcoded inside the callback; this is the **root blocker** for dynamic sorting (explained in §10)

---

## 4. Current Allow-Listed Sort Columns

`$this->columns` is set by `parent::__construct(UserVideo::class)` which is then overridden to `User::class`. Because no `$excludedColumns` are passed, `$this->columns = User::getFillable()`:
```
id, mobile, otp, otp_created_at, first_name, last_name, lang, email, certificate_count, deleted_at
```

None of the displayed columns (`price`, `status`, `program`, etc.) are in this list, so **no meaningful column is currently sortable**. Even if a `sort_column` param were sent, the hardcoded `orderBy('user_videos.id', 'DESC')` in the callback would dominate the final ORDER BY regardless.

---

## 5. Eloquent Model

**Base model:** `App\Models\User` (runtime-swapped, used for `FROM users` query start)  
**Primary data model:** `App\Models\UserVideo` — all financial columns come from the `user_videos` table via RIGHT JOIN  
**Table names in play:** `users`, `user_videos`, `videos`, `transactions`

There is no `Transaction` or `Order` model used here for the list. `Transaction` is used only in `transactionDetails()`. The financial list is built entirely from `user_videos` JOINed to the other tables.

---

## 6. Per-Column Diagnostic

### Column 1 — المعرف (ID)

| Field | Value |
|---|---|
| JSX | `{user.id}` |
| Source | `user_videos.id as id` — in SELECT |
| DB index | PRIMARY KEY on `user_videos.id` |
| Sort strategy | `orderBy('user_videos.id', $dir)` via closure |
| Backend sort key | `id` (always allowed by IndexTrait; will be overridden with closure for qualification) |

### Column 2 — الاسم (User Name)

| Field | Value |
|---|---|
| JSX | `{user.name}` → resource field `'name' => $this->full_name ?? $this->mobile` |
| Source | `users.full_name` — MySQL virtual generated column: `CONCAT(first_name, " ", last_name)` |
| DB index | None on `full_name` (virtual columns are not indexable by default); `user_videos.user_id` has FK index |
| Sort strategy | `orderBy('users.full_name', $dir)` — table already joined; add `orderBy('user_videos.id', 'asc')` tiebreaker |
| Backend sort key | `user_name` |

### Column 3 — برنامج التدريب (Program / Video Title)

| Field | Value |
|---|---|
| JSX | `{user.program}` → resource: `json_decode($this->title, true)[$lang]` |
| Source | `videos.title` — Spatie translatable JSON: `{"ar":"...","en":"..."}` |
| DB index | None on `videos.title` |
| Sort strategy | `orderByRaw("JSON_UNQUOTE(JSON_EXTRACT(videos.title, '$.ar')) $dir")` + `orderBy('user_videos.id', 'asc')` |
| Backend sort key | `program` |

### Column 4 — حالة الدفع (Payment Status)

| Field | Value |
|---|---|
| JSX | `user.transaction.payment_status` → resource: `'payment_status' => $this->status` |
| Source | `user_videos.status` — enum: `UnderReview`, `Accepted`, `Rejected` (+ others from `VideoPaymentStatus`) |
| DB index | `INDEX(['status'])` exists on `user_videos` |
| Sort strategy | Custom CASE ordering: `UnderReview=1, Accepted=2, Rejected=3, else 99`. Alphabetical would be confusing (A < R < U). |
| Backend sort key | `status` |

### Column 5 — رقم الطلب (Order ID)

| Field | Value |
|---|---|
| JSX | `{user.transaction.order_id \|\| "-"}` → resource: `'order_id' => $this->order_id ?? null` |
| Source | `transactions.order_id` — varchar, nullable |
| DB index | **None** — needs migration (see §9) |
| Sort strategy | NULL-last: `CASE WHEN transactions.order_id IS NULL THEN 1 ELSE 0 END, transactions.order_id $dir` |
| Backend sort key | `order_id` |

### Column 6 — كود الخصم (Coupon Code)

| Field | Value |
|---|---|
| JSX | `{user.coupon_code}` → resource: `'coupon_code' => $this->coupon_code ?? __('msg.noCoupon')` |
| Source | `user_videos.coupon_code` — varchar(50), nullable |
| DB index | `INDEX(['coupon_code'])` exists on `user_videos` |
| Sort strategy | NULL/empty-last: `CASE WHEN user_videos.coupon_code IS NULL OR user_videos.coupon_code = '' THEN 1 ELSE 0 END, user_videos.coupon_code $dir` |
| Backend sort key | `coupon_code` |

### Column 7 — طريقة الدفع (Payment Method)

| Field | Value |
|---|---|
| JSX | `{user.transaction.payment_method}` |
| Source | PHP computed in resource: `final_price == 0 → 'Coupon 100%'`, `card IS NOT NULL → 'Card Payment'`, else `'Apple Pay'` |
| DB columns involved | `user_videos.final_price` (virtual: `price - discount_value`), `transactions.card` |
| DB index | None on these for sort purposes |
| Sort strategy | Mirror the PHP logic in SQL CASE: `CASE WHEN user_videos.final_price = 0 THEN 1 WHEN transactions.card IS NOT NULL THEN 2 ELSE 3 END $dir` (sorts Coupon < Card < Apple alphabetically-ish; or adjust order if desired) |
| Backend sort key | `payment_method` |

### Column 8 — سعر (Price)

| Field | Value |
|---|---|
| JSX | `{user.price}` → resource: `number_format($this->price, 2)` |
| Source | `user_videos.price` — decimal(8,2), real DB column |
| DB index | None specific |
| Sort strategy | `orderBy('user_videos.price', $dir)` + `orderBy('user_videos.id', 'asc')` |
| Backend sort key | `price` |

### Column 9 — تخفيض (Discount)

| Field | Value |
|---|---|
| JSX | `{user.discount_value}` → resource: `number_format($this->discount_value, 2)` |
| Source | `user_videos.discount_value` — decimal(8,2), real DB column |
| DB index | None specific |
| Sort strategy | `orderBy('user_videos.discount_value', $dir)` + `orderBy('user_videos.id', 'asc')` |
| Backend sort key | `discount_value` |

### Column 10 — ضريبة (Tax)

| Field | Value |
|---|---|
| JSX | `{user.tax_value}` → resource: `number_format($this->tax_value, 2)` |
| Source | `user_videos.tax_value` — decimal(10,5), real DB column (stored after discount) |
| DB index | None specific |
| Sort strategy | `orderBy('user_videos.tax_value', $dir)` + `orderBy('user_videos.id', 'asc')` |
| Backend sort key | `tax_value` |

### Column 11 — مدفوع (Paid)

| Field | Value |
|---|---|
| JSX | `{user.paid}` → resource: `number_format($this->paid, 2)` |
| Source | `user_videos.paid` — decimal(8,2), real DB column ("paid amount after discount and tax") |
| DB index | None specific |
| Sort strategy | `orderBy('user_videos.paid', $dir)` + `orderBy('user_videos.id', 'asc')` |
| Backend sort key | `paid` |

### Column 12 — تاريخ للمعاملة (Transaction Date)

| Field | Value |
|---|---|
| JSX | `dayjs(user.transaction.transaction_date).fromNow()` — tooltip shows `DD/MM/YYYY HH:mm` |
| Source | resource: `'transaction_date' => $this->created_at ?? $this->user_created_at` → `user_videos.created_at` (primary; falls back to `users.created_at as user_created_at`) |
| DB index | `INDEX(['created_at'])` exists on `user_videos` |
| Sort strategy | `orderBy('user_videos.created_at', $dir)` + `orderBy('user_videos.id', 'asc')` |
| Backend sort key | `created_at` |

---

## 7. Filter Chip Params

| Filter | Param name | Accepted values | Backend handling |
|---|---|---|---|
| حالة الدفع (Payment status) | `statuses[]` (array) | `"Accepted"`, `"Rejected"`, `"UnderReview"` | `whereIn('user_videos.status', $request->statuses)` |
| كود الخصم (Coupon code search) | `coupon` (string) | any text | `where('user_videos.coupon_code', trim($coupon))` |
| القسيمة عند الشراء (Coupon presence) | `coupon_presence[]` (array) | `"with"`, `"without"` | whereNotNull / whereNull on `user_videos.coupon_code` |

All three are applied inside the `userInformation()` callback. Sort params go into URL alongside these — no collision risk (different param names).

---

## 8. Search Box

Param: `q` (string). Handled inside the callback with special-cases:
- `q ∈ ['دفع مباشر', 'No Coupon']` → `WHERE user_videos.paid > 0`
- `q ∈ ['Coupon 100%', 'Coupon']` → `WHERE user_videos.paid = 0`
- Otherwise: LIKE search across `users.full_name`, `users.email`, `users.mobile`, `videos.title`, `user_videos.status`, `transactions.order_id`

IndexTrait's built-in search loop is disabled (`$q=false` passed to `indexInit`).

---

## 9. Export Button

`users-info.tsx` line 28:
```tsx
<ExportButton permissionKey="Financial:Export" queryFun={GetUsersInfo} filename="users" />
```

`GetUsersInfo` hits `GET /financial-management/user-information` with the current `URLSearchParams` plus `export=true`. IndexTrait detects `$request->export == true` and streams the cursor via `UserInformationResource` with the export shape. **Sort params in URL will automatically flow to the export query** — no frontend change needed. The export will honor whatever `sort_column` + `sort_direction` are in the URL at the time of click.

---

## 10. Root Blocker — Hardcoded OrderBy

**Line 244 of `FinancialManagementController.php`:**
```php
$items = $items->orderBy('user_videos.id', 'DESC');
return [$items];
```

This `orderBy` is applied INSIDE the callback. In the updated IndexTrait, sort is applied AFTER the callback. Multiple `orderBy()` calls stack in Eloquent's query builder, producing:
```sql
ORDER BY user_videos.id DESC, {dynamic_sort_column} {dir}
```

Since `user_videos.id` is unique, the dynamic sort column becomes a useless tiebreaker — effectively no dynamic sorting works. **This line must be removed** before any sort can function. The default `ORDER BY id DESC` (from IndexTrait using `$this->primaryKey = 'id'` → alias `user_videos.id as id`) will take over with the same behavior.

---

## 11. Current Default Sort

`ORDER BY user_videos.id DESC` — preserved by removing the callback's hardcoded orderBy and letting IndexTrait apply `orderBy('id', 'DESC')` which resolves to the `user_videos.id as id` alias in the SELECT.

---

## 12. Summary of Required Changes

### Backend (`inaash-api`)

| File | Change |
|---|---|
| `FinancialManagementController::userInformation()` | Remove hardcoded `orderBy` from callback; add `$sortAllowed` with qualified closures for all 12 sort keys |
| New migration | Add `transactions_order_id_index` on `transactions.order_id` |

### Frontend (`inaash-dashboard`)

| File | Change |
|---|---|
| `financial/components/table.tsx` | Add `useSortParams`, SORTABLE map, replace all `TableTh` with conditional `SortableTh` |

### Status ordering rule (documented)
`UnderReview (1) → Accepted (2) → Rejected (3) → others (99)`. Ascending = pending first; descending = completed first. This matches stakeholder intuition for a financial table.

### NULL-coupon rule (documented)
Rows with null/empty `coupon_code` sort **last** in both ASC and DESC directions. Implemented via `CASE WHEN ... THEN 1 ELSE 0 END` prefix clause.

### Export behavior (documented)
Sort flows to export automatically — same endpoint, same query pipeline. No frontend or backend change needed beyond the controller fix.
