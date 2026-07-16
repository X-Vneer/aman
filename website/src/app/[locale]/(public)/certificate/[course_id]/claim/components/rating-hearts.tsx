import React, { useState } from "react"
import { ButtonGroup } from "@heroui/react"
import { Button } from "@/components/ui/heroui-button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/cn"
type Props = {
  value: number
  onValueChange: (value: number) => void
}

const RatingHearts = ({ value, onValueChange }: Props) => {
  const [hoveredStars, setHoveredStars] = useState(0)
  const handleHoverStar = (star: number) => {
    setHoveredStars(star + 1)
  }
  const handleSelectStar = (star: number) => {
    onValueChange(star + 1)
  }

  return (
    <div>
      <ButtonGroup onMouseLeave={() => setHoveredStars(value)}>
        {Array(3)
          .fill("")
          .map((_, index) => (
            <Button
              size="md"
              onMouseEnter={() => handleHoverStar(index)}
              onClick={(e) => handleSelectStar(index)}
              isIconOnly
              variant="secondary"
              key={index}>
              <Heart
                className={cn(
                  "text-2xl",
                  "m-1",
                  "fill-[#3C252C] text-[#C5BEBE]",
                  {
                    "fill-red-500 text-red-500": value > index,
                  },
                  {
                    "fill-red-500 text-red-500": hoveredStars > index,
                  },
                )}
              />
            </Button>
          ))}
      </ButtonGroup>
    </div>
  )
}

export default RatingHearts
