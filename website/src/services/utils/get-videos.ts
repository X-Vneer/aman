import { AmanApiGuest } from "@/services/aman"
import { VideosResponse } from "@/types/public-videos-response"
import React from "react"

export const getVideos = React.cache(async () => {
  const response = await AmanApiGuest.get<VideosResponse>("/videos")
  return { videos: response.data.data.items.data, content: response.data.data.helpers.introduction }
})
