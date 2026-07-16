import AmanApi from "@/services/aman"
import { BarGraphResponse } from "./types"

export const GetUsers =  async (params: URLSearchParams) => {
  const response = await AmanApi.get<BarGraphResponse>(`report/user-graph`, { params })
  return response.data.data
}
