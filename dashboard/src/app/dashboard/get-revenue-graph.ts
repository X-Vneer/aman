import AmanApi from "@/services/aman"
import { RevenueGraphResponse } from "./types"

export const GetRevenueGraph = async (params: URLSearchParams) => {
  const response = await AmanApi.get<RevenueGraphResponse>(`/home/revenue-graph`, {
    params,
  })
  return response.data.data.graph
}
