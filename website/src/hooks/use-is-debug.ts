"use client"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

export function useIsDebug() {
  const searchParams = useSearchParams()

  return useMemo(() => {
    if (typeof window === "undefined") return false

    try {
      const param = searchParams.get("is_debug")
      if (param === "1") {
        localStorage.setItem("is_debug", "1")
      } else if (param === "0") {
        localStorage.removeItem("is_debug")
      }

      return localStorage.getItem("is_debug") === "1"
    } catch {
      return false
    }
  }, [searchParams])
}
