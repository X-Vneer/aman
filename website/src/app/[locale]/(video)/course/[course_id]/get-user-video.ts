import AmanApi from "@/services/aman"
import { UserVideoResponse } from "./types"
import React from "react"

export const getUserVideo = React.cache(async (video_id: string) => {
  const response = await AmanApi.get<UserVideoResponse>(`/user/user-videos/${video_id}`)
  return response.data.data.item
})
