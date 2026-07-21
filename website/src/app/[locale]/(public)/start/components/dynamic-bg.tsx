"use client"
import { loginBackground } from "@/assets"

import { useHoveredCourse } from "./hovered-course-context"

const DynamicBg = ({ defaultImage }: { defaultImage?: string }) => {
  const { hoveredCourse } = useHoveredCourse()
  // hoveredCourse / defaultImage are complete image URLs — render as-is, no base prefix.
  const src = hoveredCourse ?? defaultImage ?? loginBackground.src

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <img
        key={src}
        className="h-full w-full bg-transparent bg-center object-cover opacity-15"
        src={src}
        alt="aman background"
      />
    </div>
  )
}

export default DynamicBg
