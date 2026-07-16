import type { ActiveFilterChip } from "@/components/common/active-filters-bar"
import { WEBSITE_LANGS } from "@/config"
import { getVideos } from "@/services/utils/get-videos"
import { formattedDate } from "@/utils/fornate-dates"
import { useQuery } from "@tanstack/react-query"
import { parseAsArrayOf, parseAsString, useQueryState, useQueryStates } from "nuqs"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

function formatLangs(langs: string[], t: (k: string) => string) {
  return langs
    .filter((l) => WEBSITE_LANGS.includes(l as (typeof WEBSITE_LANGS)[number]))
    .map((l) => t(`langs.${l}`))
    .join(", ")
}

function formatVideoIds(
  ids: string[],
  videos: { id: string | number; title: string }[] | undefined,
  t: (k: string) => string,
) {
  if (!ids.length) return ""
  return ids
    .map((id) => {
      if (id === "0") return t("not-completed")
      const v = videos?.find((x) => String(x.id) === id)
      return v?.title ?? id
    })
    .join(", ")
}

function normalizeStatuses(raw: string[]) {
  return raw.filter((s) => s !== "")
}

/** Users list */
export function useUsersListActiveFilterChips(): ActiveFilterChip[] {
  const { t } = useTranslation()
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""))
  const [filters, setFilters] = useQueryStates({
    "langs[]": parseAsArrayOf(parseAsString).withDefault([]),
    "video_ids[]": parseAsArrayOf(parseAsString).withDefault([]),
  })
  const [dateFrom, setDateFrom] = useQueryState("date_from", parseAsString.withDefault(""))
  const [dateTo, setDateTo] = useQueryState("date_to", parseAsString.withDefault(""))

  const { data: videos } = useQuery({
    queryKey: ["list", "videos"],
    queryFn: () => getVideos(),
    staleTime: 60_000,
  })

  return useMemo(() => {
    const chips: ActiveFilterChip[] = []
    if (q.trim()) {
      chips.push({
        id: "q",
        label: t("global.search"),
        value: q,
        onRemove: () => {
          void setQ(null)
        },
      })
    }
    const langs = filters["langs[]"] ?? []
    if (langs.length) {
      chips.push({
        id: "langs",
        label: t("users.filters.langs.title"),
        value: formatLangs(langs, t),
        onRemove: () => {
          void setFilters({ "langs[]": null })
        },
      })
    }
    const vids = filters["video_ids[]"] ?? []
    if (vids.length) {
      chips.push({
        id: "video_ids",
        label: t("users.filters.programs.title"),
        value: formatVideoIds(vids, videos, t),
        onRemove: () => {
          void setFilters({ "video_ids[]": null })
        },
      })
    }
    if (dateFrom && dateTo) {
      chips.push({
        id: "date-range",
        label: t("global.active-filters.date-range"),
        value: `${formattedDate(dateFrom)} — ${formattedDate(dateTo)}`,
        onRemove: () => {
          void setDateFrom(null)
          void setDateTo(null)
        },
      })
    }
    return chips
  }, [q, filters, dateFrom, dateTo, videos, t, setQ, setFilters, setDateFrom, setDateTo])
}

/** Preset + custom dates + programs (home dashboard, reports, etc.) */
export function useGraphDateAndProgramChips(options: {
  presetLabel?: (preset: string) => string
}): ActiveFilterChip[] {
  const { t } = useTranslation()
  const { presetLabel } = options
  const [dates, setDates] = useQueryState("dates", parseAsString.withDefault(""))
  const [dateFrom, setDateFrom] = useQueryState("date_from", parseAsString.withDefault(""))
  const [dateTo, setDateTo] = useQueryState("date_to", parseAsString.withDefault(""))
  const [programs, setPrograms] = useQueryState("video_ids[]", parseAsArrayOf(parseAsString).withDefault([]))

  const { data: videos } = useQuery({
    queryKey: ["list", "videos"],
    queryFn: () => getVideos(),
    staleTime: 60_000,
  })

  return useMemo(() => {
    const chips: ActiveFilterChip[] = []
    if (dateFrom && dateTo) {
      chips.push({
        id: "date-range",
        label: t("global.active-filters.date-range"),
        value: `${formattedDate(dateFrom)} — ${formattedDate(dateTo)}`,
        onRemove: () => {
          void setDateFrom(null)
          void setDateTo(null)
          void setDates(null)
        },
      })
    } else if (dates) {
      const labelFn =
        presetLabel ??
        ((d: string) => t(`home.line-graph-type.${d}` as "monthly" | "daily" | "hourly" | "weekly" | "yearly"))
      chips.push({
        id: "dates-preset",
        label: t("global.active-filters.period"),
        value: labelFn(dates),
        onRemove: () => {
          void setDates(null)
          void setDateFrom(null)
          void setDateTo(null)
        },
      })
    }
    if (programs.length) {
      chips.push({
        id: "video_ids",
        label: t("global.programs"),
        value: formatVideoIds(programs, videos, t),
        onRemove: () => void setPrograms(null),
      })
    }
    return chips
  }, [dates, dateFrom, dateTo, programs, videos, t, presetLabel, setDates, setDateFrom, setDateTo, setPrograms])
}

export function useReviewsActiveFilterChips(): ActiveFilterChip[] {
  const { t } = useTranslation()
  const [comment, setComment] = useQueryState("comment", parseAsString.withDefault(""))
  const [userFilters, setUserFilters] = useQueryStates({
    user_name: parseAsString.withDefault(""),
    user_mobile: parseAsString.withDefault(""),
    user_email: parseAsString.withDefault(""),
  })
  const [rateFilters, setRateFilters] = useQueryStates({
    rate_1: parseAsArrayOf(parseAsString).withDefault([]),
    rate_2: parseAsArrayOf(parseAsString).withDefault([]),
    rate_3: parseAsArrayOf(parseAsString).withDefault([]),
    rate_4: parseAsArrayOf(parseAsString).withDefault([]),
  })
  const [listFilters, setListFilters] = useQueryStates({
    "langs[]": parseAsArrayOf(parseAsString).withDefault([]),
    "video_ids[]": parseAsArrayOf(parseAsString).withDefault([]),
  })
  const [dateFrom, setDateFrom] = useQueryState("date_from", parseAsString.withDefault(""))
  const [dateTo, setDateTo] = useQueryState("date_to", parseAsString.withDefault(""))

  const { data: videos } = useQuery({
    queryKey: ["list", "videos"],
    queryFn: () => getVideos(),
    staleTime: 60_000,
  })

  return useMemo(() => {
    const chips: ActiveFilterChip[] = []
    if (comment.trim()) {
      chips.push({
        id: "comment",
        label: t("reviews.comment-filter"),
        value: comment,
        onRemove: () => void setComment(null),
      })
    }
    if (userFilters.user_name?.trim()) {
      chips.push({
        id: "user_name",
        label: t("users.table.name"),
        value: userFilters.user_name,
        onRemove: () => void setUserFilters({ user_name: null }),
      })
    }
    if (userFilters.user_mobile?.trim()) {
      chips.push({
        id: "user_mobile",
        label: t("users.form.mobile-input-label"),
        value: userFilters.user_mobile,
        onRemove: () => void setUserFilters({ user_mobile: null }),
      })
    }
    if (userFilters.user_email?.trim()) {
      chips.push({
        id: "user_email",
        label: t("reviews.filters.email"),
        value: userFilters.user_email,
        onRemove: () => void setUserFilters({ user_email: null }),
      })
    }
    ;([1, 2, 3, 4] as const).forEach((n) => {
      const key = `rate_${n}` as const
      const arr = rateFilters[key] ?? []
      if (arr.length) {
        chips.push({
          id: key,
          label: t(`reviews.table.${key}`),
          value: arr.join(", "),
          onRemove: () => void setRateFilters({ [key]: null }),
        })
      }
    })
    const langs = listFilters["langs[]"] ?? []
    if (langs.length) {
      chips.push({
        id: "langs",
        label: t("users.filters.langs.title"),
        value: formatLangs(langs, t),
        onRemove: () => void setListFilters({ "langs[]": null }),
      })
    }
    const vids = listFilters["video_ids[]"] ?? []
    if (vids.length) {
      chips.push({
        id: "video_ids",
        label: t("users.filters.programs.title"),
        value: formatVideoIds(vids, videos, t),
        onRemove: () => void setListFilters({ "video_ids[]": null }),
      })
    }
    if (dateFrom && dateTo) {
      chips.push({
        id: "date-range",
        label: t("global.active-filters.date-range"),
        value: `${formattedDate(dateFrom)} — ${formattedDate(dateTo)}`,
        onRemove: () => {
          void setDateFrom(null)
          void setDateTo(null)
        },
      })
    }
    return chips
  }, [
    comment,
    userFilters,
    rateFilters,
    listFilters,
    dateFrom,
    dateTo,
    videos,
    t,
    setComment,
    setUserFilters,
    setRateFilters,
    setListFilters,
    setDateFrom,
    setDateTo,
  ])
}

export function useStoriesActiveFilterChips(): ActiveFilterChip[] {
  const { t } = useTranslation()
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""))
  const [dateFrom, setDateFrom] = useQueryState("date_from", parseAsString.withDefault(""))
  const [dateTo, setDateTo] = useQueryState("date_to", parseAsString.withDefault(""))

  return useMemo(() => {
    const chips: ActiveFilterChip[] = []
    if (q.trim()) {
      chips.push({
        id: "q",
        label: t("global.search"),
        value: q,
        onRemove: () => void setQ(null),
      })
    }
    if (dateFrom && dateTo) {
      chips.push({
        id: "date-range",
        label: t("global.active-filters.date-range"),
        value: `${formattedDate(dateFrom)} — ${formattedDate(dateTo)}`,
        onRemove: () => {
          void setDateFrom(null)
          void setDateTo(null)
        },
      })
    }
    return chips
  }, [q, dateFrom, dateTo, t, setQ, setDateFrom, setDateTo])
}

export function useBlogsActiveFilterChips(): ActiveFilterChip[] {
  const { t } = useTranslation()
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""))
  const [dateFrom, setDateFrom] = useQueryState("date_from", parseAsString.withDefault(""))
  const [dateTo, setDateTo] = useQueryState("date_to", parseAsString.withDefault(""))

  return useMemo(() => {
    const chips: ActiveFilterChip[] = []
    if (q.trim()) {
      chips.push({
        id: "q",
        label: t("global.search"),
        value: q,
        onRemove: () => void setQ(null),
      })
    }
    if (dateFrom && dateTo) {
      chips.push({
        id: "date-range",
        label: t("global.active-filters.date-range"),
        value: `${formattedDate(dateFrom)} — ${formattedDate(dateTo)}`,
        onRemove: () => {
          void setDateFrom(null)
          void setDateTo(null)
        },
      })
    }
    return chips
  }, [q, dateFrom, dateTo, t, setQ, setDateFrom, setDateTo])
}

export function useContactsActiveFilterChips(): ActiveFilterChip[] {
  const { t } = useTranslation()
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""))
  const [filters, setFilters] = useQueryStates({
    "types[]": parseAsArrayOf(parseAsString).withDefault([]),
    "statuses[]": parseAsArrayOf(parseAsString).withDefault([]),
  })

  return useMemo(() => {
    const chips: ActiveFilterChip[] = []
    if (q.trim()) {
      chips.push({
        id: "q",
        label: t("global.search"),
        value: q,
        onRemove: () => void setQ(null),
      })
    }
    const types = filters["types[]"] ?? []
    if (types.length) {
      chips.push({
        id: "types",
        label: t("contacts.table.type"),
        value: types.map((ty) => t(`contacts.table.type-${ty}` as "Inquiry")).join(", "),
        onRemove: () => void setFilters({ "types[]": null }),
      })
    }
    const statuses = filters["statuses[]"] ?? []
    if (statuses.length) {
      chips.push({
        id: "statuses",
        label: t("contacts.table.status"),
        value: statuses
          .map((s) => t(`contacts.table.status-label-${s.toLowerCase() as "new"}`))
          .join(", "),
        onRemove: () => void setFilters({ "statuses[]": null }),
      })
    }
    return chips
  }, [q, filters, t, setQ, setFilters])
}

export function useReportsActiveFilterChips(): ActiveFilterChip[] {
  const { t } = useTranslation()
  const [langs, setLangs] = useQueryState("langs[]", parseAsArrayOf(parseAsString).withDefault([]))
  const [programs, setPrograms] = useQueryState("video_ids[]", parseAsArrayOf(parseAsString).withDefault([]))
  const [dates, setDates] = useQueryState("dates", parseAsString.withDefault(""))
  const [dateFrom, setDateFrom] = useQueryState("date_from", parseAsString.withDefault(""))
  const [dateTo, setDateTo] = useQueryState("date_to", parseAsString.withDefault(""))

  const { data: videos } = useQuery({
    queryKey: ["list", "videos"],
    queryFn: () => getVideos(),
    staleTime: 60_000,
  })

  return useMemo(() => {
    const chips: ActiveFilterChip[] = []
    if (langs.length) {
      chips.push({
        id: "langs",
        label: t("global.lang"),
        value: formatLangs(langs, t),
        onRemove: () => void setLangs(null),
      })
    }
    if (programs.length) {
      chips.push({
        id: "video_ids",
        label: t("global.programs"),
        value: formatVideoIds(programs, videos, t),
        onRemove: () => void setPrograms(null),
      })
    }
    if (dateFrom && dateTo) {
      chips.push({
        id: "date-range",
        label: t("global.active-filters.date-range"),
        value: `${formattedDate(dateFrom)} — ${formattedDate(dateTo)}`,
        onRemove: () => {
          void setDateFrom(null)
          void setDateTo(null)
          void setDates(null)
        },
      })
    } else if (dates) {
      chips.push({
        id: "dates-preset",
        label: t("global.active-filters.period"),
        value: t(`home.line-graph-type.${dates}` as "monthly"),
        onRemove: () => {
          void setDates(null)
          void setDateFrom(null)
          void setDateTo(null)
        },
      })
    }
    return chips
  }, [langs, programs, dates, dateFrom, dateTo, videos, t, setLangs, setPrograms, setDates, setDateFrom, setDateTo])
}

export function usePartnersActiveFilterChips(): ActiveFilterChip[] {
  const { t } = useTranslation()
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""))
  return useMemo(() => {
    if (!q.trim()) return []
    return [
      {
        id: "q",
        label: t("global.search"),
        value: q,
        onRemove: () => void setQ(null),
      },
    ]
  }, [q, t, setQ])
}
