import AmanApi from "@/services/aman"
import { GeneralStatisticsResponse } from "./types"

export const GetGeneralStatistics = async (params: URLSearchParams) => {
  const response = await AmanApi.get<GeneralStatisticsResponse>(`home/statistics`, {
    params,
  })
  return response.data.data
}
