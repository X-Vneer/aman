import AmanApi from "@/services/aman"
import { VideoResponse } from "./@types"

export const GetVideo = async ({ id }: { id: string }) => {
  const response = await AmanApi.get<VideoResponse>(`/videos/${id}/edit`)
  return response
}
