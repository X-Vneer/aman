import { VideosResponse } from "@/@types/videos"
import AmanApi from "@/services/aman"

export const getVideos = async (params?: URLSearchParams) => {
  const response = await AmanApi.get<VideosResponse>("/videos", {
    params,
  })
  return response.data.data.items.data
}
