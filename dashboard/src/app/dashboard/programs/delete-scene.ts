import AmanApi from "@/services/aman"

export const DeleteScene = async ({ id }: { id: string }) => {
  const response = await AmanApi.delete(`/scenes/${id}`)
  return response
}
