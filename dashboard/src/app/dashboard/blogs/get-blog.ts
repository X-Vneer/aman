import AmanApi from "@/services/aman"
import { Blog } from "./types"

export interface BlogSingleResponse {
  data: {
    item: Blog
  }
}

export const GetBlog = async ({ id }: { id: string }) => {
  const response = await AmanApi.get<BlogSingleResponse>(`/blogs/${id}`)
  return response.data.data.item
}
