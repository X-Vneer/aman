import React, { ComponentRef, useImperativeHandle, useRef, useState } from "react"
import { useForceUpdate } from "@mantine/hooks"
import { Pause, Play } from "lucide-react"
import { Slider } from "@heroui/react"
import { Button } from "@/components/ui/heroui-button"
import { Separator } from "@heroui/react"

const AudioPlayer = React.forwardRef(function Comp(
  { src, name, onEnd, isDisabled }: { src: string; name: string; onEnd?: () => void; isDisabled?: boolean },
  ref: React.ForwardedRef<ComponentRef<"audio">>,
) {
  const audioUrl = src
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<ComponentRef<"audio">>(null)
  useImperativeHandle(ref, () => audioRef.current!, [audioRef])

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current!.pause()
    } else {
      audioRef.current!.play()
    }
    setIsPlaying(!isPlaying)
  }

  const updateCurrentTime = () => {
    setCurrentTime(audioRef.current!.currentTime)
  }

  const handleTimeChange = (value: number) => {
    audioRef.current!.currentTime = value
    setCurrentTime(value)
  }
  const forceUpdate = useForceUpdate()

  return (
    <div className="border-primary relative flex w-full items-center gap-2 rounded-full border-2 p-2 px-4">
      <audio
        onEnded={(e) => {
          setIsPlaying(false)
          handleTimeChange(0)
          onEnd?.()
        }}
        onLoadedMetadata={forceUpdate}
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={updateCurrentTime}
      />

      <p className="text-primary w-1/2 text-center text-sm font-semibold">{name}</p>
      <Separator orientation="vertical" />
      <div dir="ltr" className="flex w-1/2 items-center gap-1">
        <div dir="ltr" className="w-full">
          <Slider
            aria-label="time line"
            className="w-full"
            minValue={0}
            step={0.01}
            maxValue={audioRef.current?.duration || 100}
            value={currentTime}
            isDisabled={isDisabled}
            onChange={(time) => {
              if (isDisabled) return
              handleTimeChange(time as number)
            }}>
            <Slider.Output className="sr-only" />
            <Slider.Track className="h-1 bg-white/15">
              <Slider.Fill />
              <Slider.Thumb className="bg-default-50 border-primary aspect-square h-4 w-4! shrink-0 border-2 before:size-0! after:size-0!" />
            </Slider.Track>
          </Slider>
        </div>

        <Button
          className={"shrink-0"}
          size="sm"
          isIconOnly
          variant="ghost"
          onPress={togglePlayPause}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}>
          {isPlaying ? <Pause color="white" size={24} /> : <Play color="white" size={24} />}
        </Button>
      </div>
    </div>
  )
})

export default AudioPlayer
