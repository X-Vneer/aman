"use client"

import { useQuery } from "@tanstack/react-query"
import { ComposableMap, Geographies, Geography } from "@vnedyalk0v/react19-simple-maps"
import { Tooltip } from "react-tooltip"

import { feature } from "topojson-client"
import { getCountriesStatistics } from ".."
import type { Country } from "../types"
import { useLocale, useTranslations } from "next-intl"
import { useQueryState } from "nuqs"
import { LOCALES } from "@/config"

const RESCUER_LABEL: Record<(typeof LOCALES)[number], string> = {
  ar: "منقذ",
  en: "rescuer",
}

function resolvedLanguage(lang: string): (typeof LOCALES)[number] {
  if (LOCALES.includes(lang as (typeof LOCALES)[number])) {
    return lang as (typeof LOCALES)[number]
  }
  return "en"
}

function rescuerLabelForLanguage(lang: string) {
  return RESCUER_LABEL[resolvedLanguage(lang)]
}

/** Reported rescuer visits worldwide (update when Analytics figures change). */
const GLOBAL_RESCUER_VISITS_COUNT = 238_054

const GEO_URL = "/countries-110.json"
const MAP_TOOLTIP_ID = "world-map-country-tooltip"
/** ISO 3166-1 numeric id for Palestine in `countries-110.json` geographies */
const PALESTINE_GEO_ID = "275"

const PALESTINE_HEART_HTML = `<span style="display:inline-flex;align-items:center;vertical-align:middle;margin-inline-start:6px;line-height:1;" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" focusable="false"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span>`

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function countryDisplayName(c: Country, language: string) {
  if (LOCALES.includes(language as (typeof LOCALES)[number])) {
    return c.Name[language as keyof Country["Name"]]
  }
  return c.Name.en
}

function countryTooltipLine(
  id: string,
  lookup: { [key: string]: Country },
  language: string,
  noDataLabel: string,
  rescuerLabel: string,
) {
  const c = lookup[id]
  if (!c) {
    const safe = escapeHtml(noDataLabel)
    return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:10px 14px;text-align:center;">
  <p style="margin:0;font-size:0.875rem;font-weight:500;color:rgba(248,250,252,0.85);">${safe}</p>
  </div>`
  }
  const label = countryDisplayName(c, language)
  const safeLabel = escapeHtml(label)
  const nameHeart = id === PALESTINE_GEO_ID ? PALESTINE_HEART_HTML : ""
  const n = new Intl.NumberFormat(resolvedLanguage(language), {
    maximumFractionDigits: 0,
  }).format(c.ValueRaw ?? c.Value)
  const safeRescuer = escapeHtml(rescuerLabel)
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
  <div style="display:flex;gap:8px;align-items:center;">
  <div style="width:1rem;height:1rem;overflow:hidden;">
  <img src="${c.Flag}" alt="${safeLabel}" style="width:100%;height:100%;object-fit:contain;" />
  </div>
    <p style="margin:0;font-size:0.875rem;font-weight:500;">${safeLabel}${nameHeart}</p>
  </div>
    <span style="font-size:0.875rem;font-weight:500;">${n}\u00A0${safeRescuer}</span>
  </div>`
}

export default function WorldMap() {
  const emptyFeatureCollection = { type: "FeatureCollection", features: [] }
  const locale = useLocale()
  const [language] = useQueryState("language", { defaultValue: locale || "ar" })
  const tMap = useTranslations("home.map")

  const { data: geoData } = useQuery({
    queryKey: ["countries-geographies"],
    queryFn: async () => {
      const response = await fetch(GEO_URL)
      if (!response.ok) throw new Error("Failed to fetch countries topology")
      const topology = await response.json()
      return feature(topology, topology.objects.countries)
    },
  })

  const { data: countriesData } = useQuery({
    queryKey: ["countries-data"],
    queryFn: () => getCountriesStatistics(),
  })

  const visitsFormatted = new Intl.NumberFormat(resolvedLanguage(language), {
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(GLOBAL_RESCUER_VISITS_COUNT)

  return (
    <div className="relative z-1 w-full rounded-[12px] bg-[#25D3D605] backdrop-blur-sm">
      <Tooltip
        id={MAP_TOOLTIP_ID}
        place="top"
        delayShow={100}
        opacity={1}
        style={{
          backgroundColor: "#0000004D",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        className="z-100 max-w-[min(20rem,calc(100vw-2rem))] rounded-xl border-[0.5px]! border-[#D1D5DB99] p-0! text-sm leading-snug text-slate-100"
        arrowColor="#0000004D"
      />
      <ComposableMap
        projectionConfig={{ scale: 115, center: [0, 20] as any }}
        projection={"geoMercator" as const}
        viewBox="0 0 800 500"
        style={{ width: "100%", height: "auto" }}>
        <Geographies geography={geoData ?? emptyFeatureCollection}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const hasUsers = countriesData?.[geo.id]?.Value
              return (
                <Geography
                  key={geo.id + geo.properties?.name}
                  geography={geo}
                  data-tooltip-id={MAP_TOOLTIP_ID}
                  data-tooltip-html={countryTooltipLine(
                    geo.id,
                    countriesData ?? {},
                    language,
                    tMap("noData"),
                    rescuerLabelForLanguage(language),
                  )}
                  data-tooltip-place="top"
                  style={{
                    default: {
                      fill: hasUsers ? "#1ad0d1db" : "#515151",
                      outline: "none",
                      stroke: "#9CA3AF",
                      strokeWidth: 0,
                    },
                    hover: {
                      fill: "#1ad0d1",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#9f5ffe",
                      outline: "none",
                    },
                    focused: {
                      fill: "#9f5ffe",
                      outline: "none",
                    },
                  }}
                  className="transition-colors duration-200 ease-out"
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="flex flex-col gap-1 px-2 pt-1 pb-2">
        <p className="text-center text-sm font-normal text-gray-300">
          {tMap("rescuerVisitsLabel")} ({visitsFormatted})
        </p>
        <p className="text-center text-xs font-light text-gray-500">{tMap("analyticsSource")}</p>
        <p className="text-end text-sm font-light text-gray-200">{tMap("exploreCaption")}</p>
      </div>
    </div>
  )
}
