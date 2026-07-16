export const formatDateToDDMMYYYY = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0") // Ensure two digits
  const month = String(date.getMonth() + 1).padStart(2, "0") // Month is zero-indexed
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

// Helper function to draw a rounded rectangle in TypeScript
export const drawRoundedRectangle = (
  ctx: CanvasRenderingContext2D, // The canvas context
  x: number, // The x-coordinate of the rectangle
  y: number, // The y-coordinate of the rectangle
  width: number, // The width of the rectangle
  height: number, // The height of the rectangle
  radius: number, // The corner radius
): void => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}
export const searchParamsToObject = (searchParams: URLSearchParams): Record<string, string> => {
  const obj: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    obj[key] = value
  })
  return obj
}
