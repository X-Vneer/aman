import AmanApi from "@/services/aman"

export const DeletePartner = async ({ id }: { id: string }) => {
  const response = await AmanApi.delete(`/partners/${id}`)
  return response
}
