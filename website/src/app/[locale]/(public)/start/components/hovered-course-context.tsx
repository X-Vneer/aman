"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

type HoveredCourseContextValue = {
  hoveredCourse: string | null
  setHoveredCourse: (value: string | null) => void
}

const HoveredCourseContext = createContext<HoveredCourseContextValue | null>(null)

export function HoveredCourseProvider({ children }: { children: ReactNode }) {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const value = useMemo(() => ({ hoveredCourse, setHoveredCourse }), [hoveredCourse])
  return <HoveredCourseContext.Provider value={value}>{children}</HoveredCourseContext.Provider>
}

export function useHoveredCourse(): HoveredCourseContextValue {
  const ctx = useContext(HoveredCourseContext)
  if (!ctx) {
    return { hoveredCourse: null, setHoveredCourse: () => {} }
  }
  return ctx
}
