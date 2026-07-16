import AmanApi from "@/services/aman"
import { BlogsResponse } from "./types"
import z from "zod"
import { CreateBlogSchema } from "@/validation/blogs"

export const updateBlog = async (id: string, blog: z.infer<typeof CreateBlogSchema>) => {
  const response = await AmanApi.put<BlogsResponse>(`/blogs/${id}`, blog)
  return response.data
}
export const createBlog = async (blog: z.infer<typeof CreateBlogSchema>) => {
  const response = await AmanApi.post<BlogsResponse>("/blogs", blog)
  return response.data
}
