import AmanApi from "@/services/aman"
import { UserGraphResponse } from "../types"

export const GetGeneralReports = async (params: URLSearchParams) => {
  const response = await AmanApi.get<UserGraphResponse>(`/report/general-graph`, { params })
  return response.data.data.graph
}
