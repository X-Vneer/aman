import dayjs from "dayjs"

export const formattedDate = (date: string | null) => {
  return date ? dayjs(date).format("DD MMMM YYYY") : ""
}
