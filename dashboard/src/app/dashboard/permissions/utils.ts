import { PERMISSIONS_OBJ } from "./config"

type Permissions = {
  [key: string]: boolean | Permissions
}

export function transformPermissionsToArray(obj: Permissions): string[] {
  const result: string[] = []

  const traverse = (current: Permissions, prefix: string = "") => {
    for (const key in current) {
      const value = current[key]
      const path = prefix ? `${prefix}:${key}` : key

      if (typeof value === "boolean") {
        if (value) {
          result.push(path)
        }
      } else if (typeof value === "object" && value !== null) {
        traverse(value, path)
      }
    }
  }

  traverse(obj)
  return result
}

export function transformArrayToPermissions(arr: string[]): Permissions {
  const result: Permissions = JSON.parse(JSON.stringify(PERMISSIONS_OBJ)) // Deep clone the template

  arr.forEach((path) => {
    const keys = path.split(":")
    let current = result

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = true
      } else {
        if (!current[key] || typeof current[key] !== "object") {
          current[key] = {}
        }
        current = current[key] as Permissions
      }
    })
  })

  return result
}
