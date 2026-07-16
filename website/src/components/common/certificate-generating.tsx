"use client"

import { AmanApiGuest } from "@/services/aman"
import { useMutation } from "@tanstack/react-query"
import { Spinner } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

const RELOAD_GUARD_WINDOW_MS = 15_000

function isPdfGenerationSuccess(body: string): boolean {
  const b = body.toLowerCase()
  return b.includes("generated success") || b.includes("the certificate already generated")
}

export default function CertificateGenerating({
  certificateNumber,
  seconds = 30,
}: {
  certificateNumber: string
  seconds?: number
}) {
  const t = useTranslations("certificate.generating")
  const [remaining, setRemaining] = useState(seconds)
  const reloaded = useRef(false)
  const reloadGuardKey = `certificate-reload-guard:${certificateNumber}`

  const safeReload = () => {
    if (reloaded.current) return
    try {
      const previousTs = Number(window.sessionStorage.getItem(reloadGuardKey) ?? "0")
      if (Date.now() - previousTs < RELOAD_GUARD_WINDOW_MS) return
      window.sessionStorage.setItem(reloadGuardKey, String(Date.now()))
    } catch {
      // If storage is unavailable, continue with in-memory guard.
    }
    reloaded.current = true
    window.location.reload()
  }

  const { mutate } = useMutation({
    mutationKey: ["certificate-generate", certificateNumber],
    mutationFn: async () => {
      const res = await AmanApiGuest.get<string>(
        `/user-videos/${encodeURIComponent(certificateNumber)}/pdf`,
        { responseType: "text", timeout: 0 },
      )
      return typeof res.data === "string" ? res.data : String(res.data ?? "")
    },
    onSuccess: (body) => {
      if (isPdfGenerationSuccess(body)) safeReload()
    },
  })
  useEffect(() => {
    mutate(undefined, {
      onError: () => {
        // Network or server error: rely on countdown fallback reload.
      },
    })
  }, [certificateNumber, mutate])

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((s) => s - 1)
    }, 1000)

    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (remaining > 0) return
    safeReload()
  }, [remaining])

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <Spinner size="lg" />
      <p className="text-lg font-semibold">{t("title")}</p>
      <p className="text-default-500 text-sm">{t("subtitle")}</p>
      <p className="text-primary text-2xl font-bold">{Math.max(remaining, 0)}</p>
    </div>
  )
}
