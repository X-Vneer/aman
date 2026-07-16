import { cn } from "@/lib/cn"
import { Heart } from "lucide-react"
import React from "react"

type Props = {
  hearts: number
}

const Hearts = (props: Props) => {
  return (
    <div id="step3" dir="ltr" className="flex items-center justify-center gap-2">
      {Array(5)
        .fill("")
        .map((element, index) => {
          return (
            <Heart
              key={index}
              className={cn("size-4 text-[#F32261]", index + 1 <= props.hearts && "fill-[#F32261]")}
            />
          )
        })}
    </div>
  )
}

export default Hearts
