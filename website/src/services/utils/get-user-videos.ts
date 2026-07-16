import AmanApi from "@/services/aman"
import { UserResponse } from "@/app/[locale]/(public)/profile/types"
import React from "react"

export const getUserVideos = React.cache(async () => {
  const response = await AmanApi.get<UserResponse>(`/user/users/me`)
  return response.data.data.item.userVideos
})
