import AmanApi from "@/services/aman"
import { CertificateResponse } from "./types"

export const GetCertificate = async () => {
  const response = await AmanApi.get<CertificateResponse>("/certificate/image")
  return response.data.data
}
