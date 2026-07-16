import type { SortDirection } from "@/hooks/use-sort-params"
import { TableTh, Tooltip } from "@mantine/core"
import { ChevronDown, ChevronUp, ChevronsUpDown, Info } from "lucide-react"

interface SortableThProps {
  sortKey: string
  label: string
  currentSortColumn: string | null
  currentSortDirection: SortDirection | null
  onSort: (col: string | null, dir: SortDirection | null) => void
  className?: string
  info?: string
}

export default function SortableTh({
  sortKey,
  label,
  currentSortColumn,
  currentSortDirection,
  onSort,
  className,
  info,
}: SortableThProps) {
  const isActive = currentSortColumn === sortKey

  const handleClick = () => {
    if (!isActive) {
      onSort(sortKey, "ASC")
    } else if (currentSortDirection === "ASC") {
      onSort(sortKey, "DESC")
    } else {
      onSort(null, null)
    }
  }

  const ariaSort: React.AriaAttributes["aria-sort"] = isActive
    ? currentSortDirection === "ASC"
      ? "ascending"
      : "descending"
    : "none"

  return (
    <TableTh className={className}>
      <div className="flex w-full items-center justify-center gap-1">
        <button
          type="button"
          onClick={handleClick}
          aria-sort={ariaSort}
          className="flex cursor-pointer select-none items-center justify-center gap-1"
          style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "inherit" }}>
          {label}
          {isActive ? (
            currentSortDirection === "ASC" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )
          ) : (
            <ChevronsUpDown size={14} className="opacity-30" />
          )}
        </button>
        {info ? (
          <Tooltip label={info} withArrow multiline w={260}>
            <span
              role="img"
              aria-label={info}
              tabIndex={0}
              className="inline-flex cursor-help items-center text-gray-500">
              <Info size={14} />
            </span>
          </Tooltip>
        ) : null}
      </div>
    </TableTh>
  )
}
