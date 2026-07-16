import { NotificationsResponse } from "@/@types/notifications"
import AmanApi from "../aman"

export const getNotifications = async ({ page }: { page: string | null }) => {
  const response = await AmanApi.get<NotificationsResponse>("/notifications", {
    params: {
      page,
    },
  })
  return response.data.data.items
}
