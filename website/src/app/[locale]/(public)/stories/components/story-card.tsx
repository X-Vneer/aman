"use client"

import { Edit } from "lucide-react"
import { Story } from "../types"
import StoreModal from "./store-modal"

type StoryCardProps = Story

const StoryCard = (props: StoryCardProps) => {
  const { title, first_name, last_name, age, content } = props
  return (
    <div className="relative h-full select-none overflow-hidden rounded-lg bg-[#141313] p-7">
      <div className="absolute -bottom-6 -right-6 opacity-10">
        <Edit className="size-40 text-gray-500" strokeWidth={0.3} />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col">
        {/* Title */}
        <h3 className="mb-5 text-xl font-semibold leading-tight text-white">"{title}"</h3>

        {/* Author and Age */}
        <div className="mb-4">
          <span className="text-white">
            {first_name} ,{" "}
          </span>
          <span className="text-xs text-[#8A8A8A]">{age}</span>
        </div>

        {/* Story excerpt */}
        <div className="mb-7 flex-1">
          <p className="line-clamp-4 text-sm leading-relaxed text-white">{content}</p>
        </div>

        {/* View more button */}
        <div className="mt-auto">
          <StoreModal {...props} />
        </div>
      </div>
    </div>
  )
}

export default StoryCard
