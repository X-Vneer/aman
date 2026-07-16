import AmanApi from "@/services/aman"
import { VideoGraphResponse } from "./types"

export const GetFinancialVideoGraph = async (params?: URLSearchParams) => {
  const response = await AmanApi.get<VideoGraphResponse>(`/financial-management/video-graph`, { params })
  return response.data.data.graph
}
