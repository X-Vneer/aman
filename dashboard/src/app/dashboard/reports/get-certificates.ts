import AmanApi from "@/services/aman"
import { BarGraphResponse } from "./types"

export const GetCertificates = async (params: URLSearchParams) => {
  const response = await AmanApi.get<BarGraphResponse>(`/report/certificate-graph`, { params })
  return response.data.data
}
