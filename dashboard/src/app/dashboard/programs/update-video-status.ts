import { Video } from "@/@types/videos"
import AmanApi from "@/services/aman"

export type ProgramStatusValue = "New" | "Updated" | null

export const putVideoStatus = async ({
  id,
  status,
}: {
  id: string
  status: ProgramStatusValue
}): Promise<Video> => {
  const response = await AmanApi.put<{ data: { item: Video } }>(`/videos/${id}/status`, { status })
  return response.data.data.item
}
