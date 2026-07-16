import AmanApi from "@/services/aman"
import { NewsListResponse } from "./types"
import z from "zod"
import { CreateNewsSchema } from "@/validation/news"

export const updateNews = async (id: string, news: z.infer<typeof CreateNewsSchema>) => {
  const response = await AmanApi.put<NewsListResponse>(`/news/${id}`, news)
  return response.data
}
export const createNews = async (news: z.infer<typeof CreateNewsSchema>) => {
  const response = await AmanApi.post<NewsListResponse>("/news", news)
  return response.data
}
