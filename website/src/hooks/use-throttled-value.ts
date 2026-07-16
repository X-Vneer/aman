import { useEffect, useRef, useState } from "react"

/**
 * Returns a throttled view of `value`: updates at most once per `intervalMs`
 * (trailing edge; latest value wins while within the window).
 */
export function useThrottledValue<T>(value: T, intervalMs: number): T {
  const [throttled, setThrottled] = useState(value)
  const lastEmittedRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestRef = useRef(value)

  useEffect(() => {
    latestRef.current = value
    const now = Date.now()
    const elapsed = now - lastEmittedRef.current

    const emit = () => {
      lastEmittedRef.current = Date.now()
      setThrottled(latestRef.current)
      timeoutRef.current = null
    }

    if (elapsed >= intervalMs) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      emit()
      return
    }

    if (timeoutRef.current === null) {
      timeoutRef.current = setTimeout(emit, intervalMs - elapsed)
    }
  }, [value, intervalMs])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return throttled
}
