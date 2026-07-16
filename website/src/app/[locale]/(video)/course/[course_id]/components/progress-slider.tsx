import React from "react"
import { Slider } from "@heroui/react"

type Props = {
  progress: number
}

const ProgressSlider = ({ progress }: Props) => {
  return (
    <div id="step1" className="w-full max-w-[100px] shrink-0 md:max-w-[125px] lg:max-w-[175px]" dir="ltr">
      <Slider
        aria-label="Course progress"
        value={progress}
        isDisabled
        className="w-full opacity-100!"
        step={0.5}
        maxValue={100}
        minValue={0}>
        <Slider.Output className="sr-only" />
        <Slider.Track className="h-1 bg-white/15">
          <Slider.Fill className="bg-primary" />
          <Slider.Thumb className="group bg-primary flex h-5.5 w-9 cursor-grab items-center justify-center rounded px-3 py-1">
            <span className="small-text text-foreground block text-sm">{progress}%</span>
          </Slider.Thumb>
        </Slider.Track>
      </Slider>
    </div>
  )
}

export default ProgressSlider
