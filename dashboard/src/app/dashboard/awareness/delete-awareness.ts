import AmanApi from "@/services/aman"

export const DeleteAwareness = async ({ id }: { id: string }) => {
  const response = await AmanApi.delete(`/awareness/${id}`)
  return response
}
