# Table Inventory — Aman Dashboard

_Generated during the `feat/table-sort-and-refresh` implementation._

## Pages with Data Tables

| Page | Route | File | Component | Endpoint | Sortable Columns | Notes |
|------|-------|------|-----------|----------|-----------------|-------|
| Users | `/dashboard/users` | `users/components/table.tsx` | Custom Mantine Table | `GET /admin/users` | `id`, `first_name`, `mobile`, `certificate_count`, `lang`, `created_at` | |
| Form Information | `/dashboard/form-information` | `form-information/components/table.tsx` | Custom Mantine Table | `GET /admin/users?has_form=true` | Same as Users | Appends `has_form=true` to params |
| Financial | `/dashboard/financial` | `financial/components/table.tsx` | Custom Mantine Table | `GET /admin/financial-management/user-information` | Refresh only | Endpoint uses multi-table JOINs; column names are ambiguous for sorting |
| Coupons | `/dashboard/coupons` | `coupons/components/table.tsx` | Custom Mantine Table | `GET /admin/coupons` | `name`, `code`, `amount`, `uses_count`, `date_start`, `date_end` | `video_ids`/`langs` excluded (JSON columns) |
| Reviews | `/dashboard/reviews` | `reviews/components/table.tsx` | Custom Mantine Table | `GET /admin/rates` | `id`, `comment` | `rate_1`–`rate_4` excluded by controller |
| Contacts | `/dashboard/contacts` | `contacts/components/table.tsx` | Custom Mantine Table | `GET /admin/contacts` | `id`, `name`, `email`, `created_at`, `subject` | |
| Partners | `/dashboard/partners` | `partners/components/table.tsx` | Custom Mantine Table | `GET /admin/partners` | `name` | |
| Stories | `/dashboard/stories` | `stories/components/table.tsx` | Custom Mantine Table | `GET /admin/stories` | `id`, `first_name`, `last_name`, `title`, `age`, `mobile`, `email` | |
| Blogs | `/dashboard/blogs` | `blogs/components/table.tsx` | Custom Mantine Table | `GET /admin/blogs` | `publish_date` | `title` excluded (translatable JSON) |
| News | `/dashboard/news` | `news/components/table.tsx` | Custom Mantine Table | `GET /admin/news` | `publish_date` | Same as Blogs |

## Pages Without Tables (out of scope)

| Page | Route | Reason |
|------|-------|--------|
| Programs | `/dashboard/programs` | Grid-card layout, not a table |
| Awareness | `/dashboard/awareness` | Grid layout, not a table |
| Certificates | `/dashboard/certificates` | Select + image display |
| Reports | `/dashboard/reports` | Charts and graphs only |
| Admins/Permissions | `/dashboard/permissions` | Card list layout (skipped per decision) |

## URL Query Parameters

All table pages share these sort params in the URL (via `nuqs`):

| Param | Type | Values | Default |
|-------|------|--------|---------|
| `sort_column` | string | any allowed column key | none (uses API default) |
| `sort_direction` | string | `ASC` \| `DESC` | none (API defaults to `DESC`) |

## Shared Components

| Component | Path | Purpose |
|-----------|------|---------|
| `SortableTh` | `src/components/common/sortable-th.tsx` | Column header with 3-state sort cycle |
| `RefreshButton` | `src/components/common/refresh-button.tsx` | Re-fetches with current params |
| `useSortParams` | `src/hooks/use-sort-params.ts` | URL-synced sort state hook |
