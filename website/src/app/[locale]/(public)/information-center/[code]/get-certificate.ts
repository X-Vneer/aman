import { AmanApiGuest } from "@/services/aman"
import React from "react"
import { InfoCenterResponse } from "../types"

export const getCertificate = React.cache(async (code: string) => {
  const response = await AmanApiGuest.get<InfoCenterResponse>(`/certificates/${code}`)
  if (response.data.data.items.length == 0) return null
  return response.data.data.items[0]
})
