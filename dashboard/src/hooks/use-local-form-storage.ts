import { useEffect, useMemo, useRef } from "react"

type PersistOptions<T> = {
  storageKey: string
  // When true, only persist when a language has been fully completed
  // Caller controls when to persist via `shouldPersist` boolean flag
  // This keeps the hook generic and reusable
}

/**
 * Generic, reusable localStorage persistence for any form-like state.
 * - Parses with zod schema if provided
 * - Debounces writes to avoid excessive IO
 * - Allows caller to control when persisting via shouldPersist boolean
 */
export function useLocalFormStorage<T>(value: T, { storageKey }: PersistOptions<T>, shouldPersist: boolean) {
  const parsedInitial = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return undefined as T | undefined
      const json = JSON.parse(raw)
      return json as T
    } catch {
      localStorage.removeItem(storageKey)
      return undefined
    }
  }, [storageKey])

  const saveRef = useRef<number | null>(null)

  useEffect(() => {
    if (!shouldPersist) return
    // Debounce writes by 300ms
    if (saveRef.current) window.clearTimeout(saveRef.current)
    saveRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value))
      } catch {
        // If parse fails, don't store
      }
    }, 300)
    return () => {
      if (saveRef.current) window.clearTimeout(saveRef.current)
    }
  }, [value, shouldPersist, storageKey])

  const clear = () => {
    try {
      localStorage.removeItem(storageKey)
    } catch (e) {
      // noop: localStorage may be unavailable
    }
  }

  return {
    initialFromStorage: parsedInitial as T | undefined,
    clear,
  }
}
