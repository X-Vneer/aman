/* eslint-disable @typescript-eslint/no-explicit-any */
export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData()

  const appendToFormData = (data: any, parentKey?: string) => {
    if (data && typeof data === "object" && !(data instanceof File)) {
      // Handle nested objects or arrays
      Object.keys(data).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key
        appendToFormData(data[key], fullKey)
      })
    } else {
      // Append scalar values or File objects
      if (parentKey) {
        formData.append(parentKey, data)
      } else {
        throw new Error("Parent key is required for scalar values.")
      }
    }
  }

  Object.keys(obj).forEach((key) => {
    appendToFormData(obj[key], key)
  })

  return formData
}
