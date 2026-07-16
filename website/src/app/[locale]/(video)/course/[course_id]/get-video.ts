import AmanApi from "@/services/aman"
import { VideoResponse } from "./types"
import React from "react"

export const getVideo = React.cache(async (video_id: string) => {
  const response = await AmanApi.get<VideoResponse>(`/user/videos/${video_id}`)
  return response.data.data.item
})
