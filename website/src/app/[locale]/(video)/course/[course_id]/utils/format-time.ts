export function formatTime(seconds: number): string {
  // Ensure the input is a valid number
  if (seconds < 0) throw new Error("Time cannot be negative")

  seconds = Math.round(seconds)

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  // Format each component to ensure two digits
  const pad = (num: number) => num.toString().padStart(2, "0")

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}
