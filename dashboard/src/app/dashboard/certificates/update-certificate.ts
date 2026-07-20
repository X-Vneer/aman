import AmanApi from "@/services/aman"

export const PutUpdateCertificate = async (data: { image: string }) => {
  const response = await AmanApi.put(`certificate/image`, data)
  return response.data
}
