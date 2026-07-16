import AmanApi from "@/services/aman"
import { FinancialStatisticsResponse } from "./types"

export const GetFinancialStatistics = async (params?: URLSearchParams) => {
  const response = await AmanApi.get<FinancialStatisticsResponse>(`/financial-management/statistics`, {
    params,
  })
  return response.data.data
}
