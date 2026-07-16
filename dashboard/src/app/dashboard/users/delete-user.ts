import AmanApi from "@/services/aman"

export const DeleteUser = async ({ id }: { id: string }) => {
  const response = await AmanApi.delete(`/users/${id}`)
  return response.data
}
