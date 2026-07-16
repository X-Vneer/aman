import { parseAsString, useQueryStates } from "nuqs"

export type SortDirection = "ASC" | "DESC"

export function useSortParams() {
  const [sort, setSort] = useQueryStates({
    sort_column: parseAsString,
    sort_direction: parseAsString,
  })

  const setSortState = (column: string | null, direction: SortDirection | null) => {
    setSort({ sort_column: column, sort_direction: direction })
  }

  return {
    sortColumn: sort.sort_column ?? null,
    sortDirection: (sort.sort_direction as SortDirection) ?? null,
    setSortState,
  }
}
