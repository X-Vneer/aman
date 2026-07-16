import AmanApi from "@/services/aman"
import { BlogsResponse } from "./types"

export const GetBlogs = async (params: URLSearchParams) => {
  const response = await AmanApi.get<BlogsResponse>(`/blogs`, {
    params,
  })
  return response.data.data
}
