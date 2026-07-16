import AmanApi from "@/services/aman"
import { StoriesResponse } from "./types"

export const GetStories = async (params: URLSearchParams) => {
  const response = await AmanApi.get<StoriesResponse>(`/stories`, {
    params,
  })
  return response.data.data
}
