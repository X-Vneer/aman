# Adding Sort + Refresh to a New Table Page

Five steps to make any new table page sortable and refreshable.

## 1. Declare the sortable columns

At the top of your `table.tsx`, add a mapping from header key to API column name:

```tsx
const SORTABLE: Record<string, string> = {
  name: "name",         // header key → sort_column value the API expects
  created_at: "created_at",
}
```

Only include columns that exist in the model's `$fillable` on the backend and
are not JSON fields or computed values (see `docs/table-inventory.md`).

## 2. Pull in sort state and refetch

```tsx
import { useSortParams } from "@/hooks/use-sort-params"
import SortableTh from "@/components/common/sortable-th"
import RefreshButton from "@/components/common/refresh-button"

const { sortColumn, sortDirection, setSortState } = useSortParams()

const { data, status, error, refetch, isFetching } = useQuery({ ... })
```

## 3. Add the refresh button next to the total count

```tsx
<Group justify="space-between" align="center">
  {status === "success" ? <TableTotalCount meta={data.items.meta} /> : <span />}
  <RefreshButton refetch={refetch} isFetching={isFetching} />
</Group>
```

## 4. Replace sortable column headers

```tsx
{tableHead.map((element) => {
  const sortKey = SORTABLE[element]
  return sortKey ? (
    <SortableTh
      key={element}
      sortKey={sortKey}
      label={t(`yourModule.table.${element}`)}
      currentSortColumn={sortColumn}
      currentSortDirection={sortDirection}
      onSort={setSortState}
      className="!text-center"
    />
  ) : (
    <TableTh key={element} className="!text-center">
      {t(`yourModule.table.${element}`)}
    </TableTh>
  )
})}
```

## 5. Register allowed columns on the backend

In `aman-api`, open the relevant controller and verify the model's
`$fillable` array contains the columns you want to sort by. The `IndexTrait`
builds its allow-list automatically from `$fillable` minus `$excludedColumns`.
No code change is needed unless you want to restrict sorting to a subset.

## How it works end-to-end

- `useSortParams` stores `sort_column` + `sort_direction` in the URL via `nuqs`.
- `useOptimisticSearchParams()` (already used in every table) reads all URL params.
- The `queryKey` already includes `searchParams.toString()`, so TanStack Query
  re-fetches automatically when sort params change.
- The backend `IndexTrait` reads `sort_column` and `sort_direction` from the
  request and applies `orderBy` before pagination.
- `RefreshButton` calls `refetch()` — no URL change, no filter reset.
