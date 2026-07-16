"use client"

import type { Rate } from "../types"
import { AnimatePresence, motion } from "framer-motion"
import { Star } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

function mapRatesToComments(rates: Rate[]) {
  return rates.map((r) => ({
    name: r.user?.full_name?.trim() || r.user_name || "—",
    tag: r.video_title?.trim() || "—",
    comment: r.comment?.trim() || "",
  }))
}

type CommentsSectionProps = {
  rates?: Rate[]
}

export default function CommentsSection({ rates = [] }: CommentsSectionProps) {
  const fromApi = mapRatesToComments(rates).filter((c) => c.comment.length > 0)
  const items = fromApi.length > 0 ? fromApi : []

  const len = items.length
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (len <= 1) return
    const id = window.setInterval(() => {
      setOffset((o) => (o + 1) % len)
    }, 5000)
    return () => window.clearInterval(id)
  }, [len])

  const visible = [0, 1, 2].map((i) => items[(offset + i) % len])

  return (
    <section className="mx-auto mt-4 w-full max-w-7xl px-4 pb-8 md:px-6 md:pb-12">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={offset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="grid gap-3 divide-x rounded-[8px] border border-[#FFFFFF08] bg-[#FFFFFF08] md:grid-cols-3">
          {visible.map((item, index) => (
            <article key={`${offset}-${index}-${item.name}`} className="px-4 py-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.name.trim().split(" ")[0]}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star strokeWidth={"1.2"} className="size-4 fill-[#FBBF24] text-[#FBBF24]" />
                    <Star strokeWidth={"1.2"} className="size-4 fill-[#FBBF24] text-[#FBBF24]" />
                    <Star strokeWidth={"1.2"} className="size-4 fill-[#FBBF24] text-[#FBBF24]" />
                  </div>
                </div>
                <div className="mb-2 inline-flex rounded-full bg-[#0bc2c8]/15 px-2 py-0.5 text-[10px] font-medium text-[#53e6ea]">
                  {item.tag}
                </div>
              </div>
              <p className="line-clamp-1 text-xs leading-5 text-white/80">{item.comment}</p>
            </article>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
