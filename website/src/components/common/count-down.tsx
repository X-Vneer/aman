import React, { memo, useCallback, useEffect, useState } from "react"
import { Chip } from "@heroui/react"
import { Timer } from "lucide-react"
import ReactCountdown, { CountdownRendererFn, zeroPad } from "react-countdown"
import { cn } from "@/lib/cn"

type Props = {
  date: number
  result: React.ReactNode
  alert?: boolean
  onComplete?: () => void
  className?: string
}

const Countdown = React.forwardRef<ReactCountdown, Props>(function Component(
  { date, result, alert, onComplete, className }: Props,
  ref,
) {
  const renderer: CountdownRendererFn = useCallback(
    ({ seconds, minutes, completed }) => {
      if (completed) {
        // Render a completed state
        onComplete?.()
        return result
      } else {
        // Render a countdown
        const timeInSec = seconds + minutes * 60
        return (
          <Chip
            className={cn("border-1.5 rounded-lg", className)}
            size="lg"
            color={alert ? (timeInSec <= 10 ? "danger" : "accent") : "accent"}
            variant="secondary">
            <div className="flex items-center gap-3">
              <Timer className="size-5" strokeWidth={1.4} />
              <Chip.Label>{zeroPad(timeInSec)}</Chip.Label>
            </div>
          </Chip>
        )
      }
    },
    [result],
  )

  const [server, setServer] = useState(true)
  useEffect(() => {
    if (typeof window !== "undefined") setServer(false)
  }, [])
  if (server) return null
  return (
    <div dir="ltr" className="flex items-center justify-center">
      <ReactCountdown ref={ref} date={date} renderer={renderer} />
    </div>
  )
})

export default memo(Countdown)
