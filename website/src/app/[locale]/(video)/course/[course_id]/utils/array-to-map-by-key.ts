import { timeToSeconds } from "./time-to-seconds"

export function arrayToMapByKey<T>(arr: T[], key: keyof T): Map<string, T> {
  const map = new Map<string, T>()

  arr.forEach((item) => {
    if (item[key]) {
      map.set(String(timeToSeconds(item[key] as string)), item) // Convert the key value to string to ensure consistent Map keys
    }
  })

  return map
}
