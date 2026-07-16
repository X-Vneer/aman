import AmanApi from "@/services/aman"
import { CertificatesResponse } from "./types"

export const GetCertificates = async (params?: URLSearchParams) => {
  const response = await AmanApi.get<CertificatesResponse>(`/videos`, {
    params,
  })

  return response.data.data
}
