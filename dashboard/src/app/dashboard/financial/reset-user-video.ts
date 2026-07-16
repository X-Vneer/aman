import AmanApi from "@/services/aman"

export const ResetUserVideo = async ({ id }: { id: string }) => {
  const response = await AmanApi.post<{ data: { item: unknown } }>(`/user-videos/${id}/reset`)
  return response.data.data
}
