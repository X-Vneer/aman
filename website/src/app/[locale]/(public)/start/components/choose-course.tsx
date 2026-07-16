"use client"

import { Card, Chip, ChipRoot, Label, Popover, Radio, RadioGroup } from "@heroui/react"
import { PlayCircle, Search, SlidersHorizontal, Timer } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useMemo, useRef, useState, type RefObject } from "react"

import Button from "@/components/ui/button"
import { useThrottledValue } from "@/hooks/use-throttled-value"
import { cn } from "@/lib/cn"
import { Link } from "@/lib/i18n/navigation"
import { Video } from "@/types/public-videos-response"

import { useHoveredCourse } from "./hovered-course-context"

const SEARCH_THROTTLE_MS = 500

export type CourseListFilter = "all" | "updated-programs" | "new-status" | "most-viewed"

const FILTER_OPTIONS: CourseListFilter[] = ["all", "updated-programs", "new-status", "most-viewed"]

function ProgramStatusBadge({
  status,
  labelNew,
  labelUpdated,
}: {
  status: "New" | "Updated"
  labelNew: string
  labelUpdated: string
}) {
  return (
    <ChipRoot
      style={{ boxShadow: "8px 8px 48px 0px #9F5FFE66" }}
      variant="primary"
      className={status === "Updated" ? "bg-primary!" : "bg-secondary!"}
      size="lg">
      <Chip.Label>{status === "New" ? labelNew : labelUpdated}</Chip.Label>
    </ChipRoot>
  )
}

function applyFilter(videos: Video[], filter: CourseListFilter): Video[] {
  switch (filter) {
    case "updated-programs":
      return videos.filter((v) => v.status === "Updated")
    case "new-status":
      return videos.filter((v) => v.status === "New")
    case "most-viewed":
      return [...videos].sort((a, b) => b.view_count - a.view_count)
    default:
      return videos
  }
}

type Props = {
  videos: Video[]
}

type CourseSearchFieldProps = {
  glassSurface: string
  placeholder: string
  filterAriaLabel: string
  filterTitle: string
  filter: CourseListFilter
  onFilterChange: (value: CourseListFilter) => void
  filterLabels: Record<CourseListFilter, string>
  filterHints: Partial<Record<CourseListFilter, string>>
  inputRef: RefObject<HTMLInputElement | null>
  onThrottledQueryChange: (query: string) => void
}

function CourseSearchField({
  glassSurface,
  placeholder,
  filterAriaLabel,
  filterTitle,
  filter,
  onFilterChange,
  filterLabels,
  filterHints,
  inputRef,
  onThrottledQueryChange,
}: CourseSearchFieldProps) {

  const [inputValue, setInputValue] = useState("")
  const throttledQuery = useThrottledValue(inputValue, SEARCH_THROTTLE_MS)

  useEffect(() => {
    onThrottledQueryChange(throttledQuery)
  }, [throttledQuery, onThrottledQueryChange])

  const locale = useLocale()
  const isRtl = locale === "ar" || locale === "ur"
  return (
    <div className="flex w-full max-w-2xl items-stretch gap-3">
      <label
        className={cn(
          "flex min-h-9 flex-1 cursor-text items-center gap-3 px-4 py-1.5 lg:min-h-12 lg:py-2.5",
          glassSurface,
        )}>
        <Search className="size-5 shrink-0 text-white/70" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
          autoComplete="off"
          aria-label={placeholder}
        />
      </label>
      <Popover>
        <Popover.Trigger
          aria-label={filterAriaLabel}
          className={cn(
            "flex size-12 shrink-0 cursor-pointer items-center justify-center transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-white/40",
            glassSurface,
            filter !== "all" && "ring-secondary/80 ring-2",
          )}>
          <SlidersHorizontal className="size-5 text-white/70" aria-hidden />
        </Popover.Trigger>
        <Popover.Content
          placement="bottom end"
          offset={10}
          className="border border-white/20 bg-[#272525]/95 shadow-xl backdrop-blur-md supports-backdrop-filter:bg-[#272525]/90">
          <Popover.Dialog dir={isRtl ? "rtl" : "ltr"} className="p-4">
            <Popover.Heading className="text-foreground text-sm font-semibold">{filterTitle}</Popover.Heading>
            <RadioGroup
              name="course-list-filter"
              value={filter}
              onChange={(value) => onFilterChange(value as CourseListFilter)}
              className="mt-3 flex w-full min-w-xs flex-col gap-0">
              {FILTER_OPTIONS.map((key) => (
                <Radio
                  key={key}
                  value={key}
                  className={cn(
                    "mt-3! w-full rounded-xl border border-white/15 bg-white/5 p-0",
                    "data-[selected=true]:border-secondary/80 data-[selected=true]:bg-white/10",
                  )}>
                  <div className="flex w-full cursor-pointer items-start gap-3 px-3 py-2.5">
                    <Radio.Control className="mt-0.5 shrink-0">
                      <Radio.Indicator />
                    </Radio.Control>
                    <Radio.Content className="min-w-0 flex-1">
                      <Label className="text-foreground text-sm leading-snug">{filterLabels[key]}</Label>
                    </Radio.Content>
                  </div>
                </Radio>
              ))}
            </RadioGroup>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  )
}

const ChooseCourse = (props: Props) => {
  const { setHoveredCourse } = useHoveredCourse()
  const t = useTranslations("start")
  const [search, setSearch] = useState("")
  const [courseFilter, setCourseFilter] = useState<CourseListFilter>("all")
  const searchInputRef = useRef<HTMLInputElement>(null)
  console.log('vidoes',props.videos)
  const filteredVideos = useMemo(() => {
    const afterFilter = applyFilter(props.videos, courseFilter)
    const q = search.trim().toLowerCase()
    return !q ? afterFilter : afterFilter.filter((v) => v.title.toLowerCase().includes(q))
  }, [props.videos, courseFilter, search])

  const filterLabels: Record<CourseListFilter, string> = {
    all: t("filter-all"),
    "updated-programs": t("filter-updated-programs"),
    "new-status": t("filter-new-status"),
    "most-viewed": t("filter-most-viewed"),
  }
  const filterHints: Partial<Record<CourseListFilter, string>> = {
    "new-status": t("filter-new-status-hint"),
  }

  const handleHover = (value: string) => {
    return () => setHoveredCourse(value)
  }

  const glassSurface =
    "rounded-3xl border border-white/20 bg-[#272525]/70 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-[#272525]/55"

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <CourseSearchField
        glassSurface={glassSurface}
        placeholder={t("search-placeholder")}
        filterAriaLabel={t("filter-aria-label")}
        filterTitle={t("filter-title")}
        filter={courseFilter}
        onFilterChange={setCourseFilter}
        filterLabels={filterLabels}
        filterHints={filterHints}
        inputRef={searchInputRef}
        onThrottledQueryChange={setSearch}
      />

      {filteredVideos.length === 0 ? (
        <p className="text-foreground/80 text-center text-sm">{t("no-results")}</p>
      ) : null}

      <div className={cn("flex w-full flex-col flex-wrap items-center justify-center gap-4 md:flex-row")}>
        {filteredVideos.map((course) => (
          <div
            key={course.id}
            className="group relative aspect-4/3 w-full max-w-97.5 grow md:min-w-80 lg:w-1/2 lg:min-w-96"
            onMouseEnter={handleHover(course.logo)}>
            <Card className="relative h-full w-full overflow-hidden border-none p-0">
              {course.status === "New" || course.status === "Updated" ? (
                <div className="pointer-events-none absolute inset-s-5 top-5 z-20 max-w-[calc(100%-1.5rem)]">
                  <ProgramStatusBadge
                    status={course.status}
                    labelNew={t("video-status-new")}
                    labelUpdated={t("video-status-updated")}
                  />
                </div>
              ) : null}
              <div className="absolute right-0 bottom-0 left-0 z-10 bg-linear-to-t from-black/90 via-black/50 to-transparent p-5 duration-200 group-hover:opacity-0">
                <h2 className="text-xl font-semibold text-white">{course.title}</h2>
              </div>
              <Card.Header className="relative isolate z-10 flex h-full flex-col items-start! gap-3 bg-[#272525E5] p-5 opacity-0 duration-300 group-hover:opacity-100">
                {course.status === "New" || course.status === "Updated" ? (
                  <div className="w-fit max-w-full shrink-0">
                    <ProgramStatusBadge
                      status={course.status}
                      labelNew={t("video-status-new")}
                      labelUpdated={t("video-status-updated")}
                    />
                  </div>
                ) : null}
                <h4 className="text-foreground w-full min-w-0 text-xl font-semibold">{course.title}</h4>
                <p className="text-foreground line-clamp-3 text-sm">{course.description}</p>
                <Chip className="bg-[#27252570]">
                  <Timer size={18} />
                  {course.length}
                </Chip>
                <Button
                  as={Link}
                  href={`/course/${course.id}`}
                  className="mt-auto shrink-0"
                  startContent={<PlayCircle />}>
                  {t("start-course-button")}
                </Button>
              </Card.Header>
              <img
                className="absolute top-0 z-0 h-full w-full object-cover"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                src={course.logo}
                alt={course.title}
              />
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChooseCourse
