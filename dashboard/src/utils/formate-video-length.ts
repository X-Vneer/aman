import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import i18n from "@/lib/i18n" // adjust the path based on your setup

dayjs.extend(duration)

export function formatToMinutesSeconds(input: string): string {
  const [hours, minutes, seconds] = input.split(":").map(Number)

  // Convert all to total seconds
  const totalSeconds = hours * 3600 + minutes * 60 + seconds

  // Use dayjs duration
  const dur = dayjs.duration(totalSeconds, "seconds")

  const totalMinutes = Math.floor(dur.asMinutes())
  const remainingSeconds = dur.seconds().toString().padStart(2, "0")
  const unit = i18n.language === "ar" ? "د" : "m"

  return `${totalMinutes}.${remainingSeconds} ${unit}`
}
