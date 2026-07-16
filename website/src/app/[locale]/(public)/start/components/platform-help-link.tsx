"use client"

import { motion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/lib/cn"
import { Link } from "@/lib/i18n/navigation"

const STORAGE_KEY = "aman.start-platform-help-collapsed"
const CHEVRON_W = 44

const transition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 38,
  mass: 0.65,
}

type Props = {
  href?: string
  label: string
  className?: string
}

export default function PlatformHelpLink({ href = "/course/how-to-use", label, className }: Props) {
  const t = useTranslations("start")
  const locale = useLocale()
  const isRtl = locale === "ar" || locale === "ur"

  const [isOpen, setIsOpen] = useState(true)
  const [pillWidth, setPillWidth] = useState(0)
  const pillMeasureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setIsOpen(false)
      }
    } catch {
      // ignore
    }
  }, [])

  useLayoutEffect(() => {
    const el = pillMeasureRef.current
    if (!el) return
    const measure = () => setPillWidth(el.offsetWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [label])

  const persistCollapsed = (collapsed: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0")
    } catch {
      // ignore
    }
  }

  const toggle = () => {
    setIsOpen((open) => {
      const next = !open
      persistCollapsed(!next)
      return next
    })
  }

  const openWidthPx = pillWidth > 0 ? pillWidth + CHEVRON_W : null

  const ToggleChevron = isOpen ? (isRtl ? ChevronLeft : ChevronRight) : isRtl ? ChevronRight : ChevronLeft

  return (
    <div className={cn("pointer-events-none z-10 flex w-full justify-end", className)}>
      <div className="pointer-events-auto rounded-s-full rounded-e-none shadow-[8px_8px_48px_0px_#9F5FFE66]">
        <motion.div
          initial={false}
          animate={!isOpen ? { width: CHEVRON_W } : openWidthPx != null ? { width: openWidthPx } : false}
          style={isOpen && openWidthPx == null ? { width: "max-content" } : undefined}
          transition={transition}
          className="flex min-h-13 shrink-0 items-stretch justify-end gap-0 overflow-hidden rounded-s-full rounded-e-none bg-[#9F5FFE]">
          <div ref={pillMeasureRef} className="inline-flex min-w-0 shrink-0">
            <Link
              href={href}
              className={cn(
                "inline-flex items-center py-3 ps-6 pe-3 text-start text-sm font-medium text-white transition-opacity outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
              )}>
              <span className="min-w-0 flex-1 leading-snug">{label}</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? t("platform-help-collapse") : t("platform-help-expand")}
            style={{ width: CHEVRON_W }}
            className={cn(
              "flex shrink-0 cursor-pointer items-center justify-center rounded-none border-s border-none border-white/20 bg-transparent text-white transition-colors outline-none hover:bg-white/10 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
            )}>
            <ToggleChevron className="size-5 shrink-0" aria-hidden strokeWidth={2.25} />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
