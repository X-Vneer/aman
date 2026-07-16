import AmanApi from "@/services/aman"
import { NewsItem } from "./types"

export interface NewsItemResponse {
  data: {
    item: NewsItem
  }
}

export const GetNewsItem = async ({ id }: { id: string }) => {
  const response = await AmanApi.get<NewsItemResponse>(`/news/${id}`)
  return response.data.data.item
}
