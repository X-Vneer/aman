import AmanApi from "@/services/aman"

export const DeleteCourse = async ({ id }: { id: string }) => {
  const response = await AmanApi.delete(`/videos/${id}`)
  return response
}
