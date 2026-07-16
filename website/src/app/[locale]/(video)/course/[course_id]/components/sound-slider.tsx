import { Slider } from "@heroui/react"
import { Volume2, VolumeOff } from "lucide-react"
import React, { useState } from "react"
import { useCourseStore } from "../store/course-store-provider"
import { Button } from "@/components/ui/heroui-button"

type Props = {}

const SoundSlider = (props: Props) => {
  const { volume, changeVolume } = useCourseStore((state) => ({
    volume: state.volume,
    changeVolume: state.changeVolume,
  }))
  const [old, setOld] = useState(0)

  const toggleVolume = () => {
    changeVolume(old)
    setOld(volume)
  }
  return (
    <div className="text-foreground flex items-center gap-3">
      <div dir="ltr" className="min-w-20">
        <Slider
          aria-label="sound volume"
          className="w-full"
          step={0.1}
          maxValue={1}
          minValue={0}
          value={volume}
          onChange={(value) => {
            changeVolume(value as number)
            setOld(0)
          }}>
          <Slider.Output className="sr-only" />
          <Slider.Track className="h-1 bg-white/15">
            <Slider.Fill />
            <Slider.Thumb className="bg-default-50 border-primary aspect-square h-4 w-4! shrink-0 border-2 before:size-0! after:size-0!" />
          </Slider.Track>
        </Slider>
      </div>
      <Button
        onPress={toggleVolume}
        variant="ghost"
        isIconOnly
        aria-label={volume === 0 ? "Unmute volume" : "Mute volume"}>
        {volume === 0 ? <VolumeOff /> : <Volume2 />}
      </Button>
    </div>
  )
}

export default SoundSlider
