import AmanApi from "@/services/aman"
import { Story } from "./types"

export interface UpdateStoryData {
  title?: string
  content?: string
  first_name?: string
  last_name?: string
  mobile?: string
  email?: string
  video_id?: string
  age?: string
}

export const UpdateStory = async (id: string, data: UpdateStoryData) => {
  const response = await AmanApi.put<{ data: { item: Story } }>(`/stories/${id}`, data)
  return response.data.data.item
}
