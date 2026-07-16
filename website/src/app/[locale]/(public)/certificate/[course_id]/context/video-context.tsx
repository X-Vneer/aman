"use client"
import { UserVideo } from "@/app/[locale]/(video)/course/[course_id]/types"
import React, { createContext, useContext } from "react"

const VideoContext = createContext<UserVideo | null>(null)

export const VideoProvider = ({ children, video }: { children: React.ReactNode; video: UserVideo }) => {
  return <VideoContext.Provider value={video}>{children}</VideoContext.Provider>
}

export const useVideo = () => {
  const value = useContext(VideoContext)
  if (!value) throw new Error("useVideo should be VideosContext")

  return value
}
