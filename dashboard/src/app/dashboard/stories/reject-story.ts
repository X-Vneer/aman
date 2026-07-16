import AmanApi from "@/services/aman"
import { Story } from "./types"

export const RejectStory = async (id: string) => {
  const response = await AmanApi.put<{ data: { item: Story } }>(`/stories/${id}/reject`)
  return response.data.data.item
}
