import AmanApi from "@/services/aman"

export const DeleteQuestion = async ({ id }: { id: string }) => {
  const response = await AmanApi.delete(`/questions/${id}`)
  return response
}
