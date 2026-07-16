export function timeToSeconds(time: string): number {
  // Split the time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = time.split(":").map(Number)

  // Convert hours and minutes to seconds and add the seconds part
  return hours * 3600 + minutes * 60 + seconds
}
