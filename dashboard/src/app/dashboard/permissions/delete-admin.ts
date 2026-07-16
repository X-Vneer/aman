import AmanApi from "@/services/aman"

export const DeleteAdmin = async ({ id }: { id: string }) => {
  const response = await AmanApi.delete(`/admins/${id}`)
  return response.data
}
