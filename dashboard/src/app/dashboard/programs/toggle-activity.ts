import { Video } from "@/@types/videos"
import AmanApi from "@/services/aman"

export const PostToggleActivity = async ({ id, status }: { id: string; status: "true" | "false" }) => {
  const response = await AmanApi.put<{ data: { item: Video } }>(`/videos/${id}/toggleActive/${status}`)
  return response.data.data.item
}
