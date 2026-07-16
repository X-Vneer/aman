import AmanApi from "@/services/aman"
import { Story } from "./types"

export const ToggleStoryVisibility = async ({ id, isHidden }: { id: string; isHidden: boolean }) => {
  const response = await AmanApi.put<{ data: { item: Story } }>(
    `/stories/${id}/toggleActive/${isHidden.toString()}`,
  )
  return response.data.data.item
}
