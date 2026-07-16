import AmanApi from "@/services/aman"
import { NewsListResponse } from "./types"

export const GetNewsList = async (params: URLSearchParams) => {
  const response = await AmanApi.get<NewsListResponse>(`/news`, {
    params,
  })
  return response.data.data
}
