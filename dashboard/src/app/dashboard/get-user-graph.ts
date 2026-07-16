import AmanApi from "@/services/aman"
import { UserGraphResponse } from "./types"

export const GetUserGraph = async (params: URLSearchParams) => {
  const response = await AmanApi.get<UserGraphResponse>(`/home/user-graph`, {
    params,
  })
  return response.data.data.graph
}
