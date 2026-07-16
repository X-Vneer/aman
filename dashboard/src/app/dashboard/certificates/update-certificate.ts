import AmanApi from "@/services/aman"

export const PutUpdateCertificate = async ({
  id,
  data,
}: {
  id: string
  data: { certificate_url: string }
}) => {
  const response = await AmanApi.put(`videos/${id}/certificate/image`, data)
  return response.data
}
