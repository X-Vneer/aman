import AmanApi from "@/services/aman"

export const ResetUserVideosByVideo = async ({ id }: { id: string }) => {
  const response = await AmanApi.post<{ data: { affected: number } }>(
    `/user-videos/reset-by-video/${id}`,
  )
  return response.data.data
}

export const ResetAllUserVideos = async () => {
  const response = await AmanApi.post<{ data: { affected: number } }>(`/user-videos/reset-all`)
  return response.data.data
}
