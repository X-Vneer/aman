import type { SuccessResponse } from "@/types"
import { AmanApiGuest } from "@/services/aman"
import axios from "axios"
import { cache } from "react"

import type { News, NewsResponse } from "./types"

export type NewsListResult = {
  news: News[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    from: number | null
    to: number | null
    total: number
  }
}

export const getNewsList = async ({
  per_page = 9,
  page = 1,
}: {
  per_page?: number
  page?: number
}): Promise<NewsListResult> => {
  const response = await AmanApiGuest.get<NewsResponse>("/news", {
    params: {
      per_page,
      page,
    },
  })
  const { data: items, meta } = response.data.data.items
  return {
    news: items,
    meta: {
      current_page: meta.current_page,
      last_page: meta.last_page,
      per_page: meta.per_page,
      from: meta.from,
      to: meta.to,
      total: meta.total,
    },
  }
}

export const getNewsItem = cache(async (id: string): Promise<News | null> => {
  try {
    const response = await AmanApiGuest.get<SuccessResponse<News>>(`/news/${id}`)
    return response.data.data.item
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) return null
    throw e
  }
})
