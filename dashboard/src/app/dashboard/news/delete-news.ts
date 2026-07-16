import AmanApi from "@/services/aman"

export const DeleteNews = async ({ id }: { id: string }) => {
  const response = await AmanApi.delete(`/news/${id}`)
  return response.data
}
