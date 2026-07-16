import AmanApi from "@/services/aman"
import { Story } from "./types"

export const ApproveStory = async (id: string) => {
  const response = await AmanApi.put<{ data: { item: Story } }>(`/stories/${id}/approve`)
  return response.data.data.item
}
