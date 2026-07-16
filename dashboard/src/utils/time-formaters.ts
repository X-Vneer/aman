import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"

dayjs.extend(duration)

type TimeObject = { h: number; m: number; s: number }

export function formatTime({ h, m, s }: TimeObject): string {
  return dayjs.duration({ hours: h, minutes: m, seconds: s }).format("HH:mm:ss")
}

export function parseTime(timeStr: string): TimeObject {
  const [h, m, s] = timeStr.split(":").map(Number)
  return { h, m, s }
}

export function getTimeDifference(t1: TimeObject, t2: TimeObject): TimeObject {
  const d1 = dayjs.duration({ hours: t1.h, minutes: t1.m, seconds: t1.s })
  const d2 = dayjs.duration({ hours: t2.h, minutes: t2.m, seconds: t2.s })
  const diff = dayjs.duration(Math.abs(d1.asSeconds() - d2.asSeconds()), "seconds")
  return {
    h: diff.hours(),
    m: diff.minutes(),
    s: diff.seconds(),
  }
}

export function formatTimeDifference(t1: TimeObject, t2: TimeObject): string {
  const diff = getTimeDifference(t1, t2)
  return formatTime(diff)
}
