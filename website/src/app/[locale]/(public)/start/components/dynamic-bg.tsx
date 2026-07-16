"use client"
import { loginBackground } from "@/assets"
import Image from "next/image"

import { useHoveredCourse } from "./hovered-course-context"

const DynamicBg = () => {
  const { hoveredCourse } = useHoveredCourse()

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <Image
        key={hoveredCourse ?? "default"}
        className={"h-full w-full bg-transparent bg-center object-cover opacity-15"}
        src={hoveredCourse ?? loginBackground}
        alt="aman background"
        fill
        priority
      />
    </div>
  )
}

export default DynamicBg
