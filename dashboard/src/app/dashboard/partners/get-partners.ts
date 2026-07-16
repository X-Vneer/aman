import AmanApi from "@/services/aman"
import { PartnersResponse } from "./types"

export const GetPartners = async (params: URLSearchParams) => {
  const response = await AmanApi.get<PartnersResponse>(`/partners`, {
    params,
  })
  return response.data.data
}
