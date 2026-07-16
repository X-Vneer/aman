"use client"
import { Video } from "@/types/public-videos-response"
import React, { createContext, useContext } from "react"
import { UserVideo } from "../types"

const VideosContext = createContext<{ videos: Video[]; currentVideo: UserVideo } | null>(null)

export const VideosProvider = ({
  children,
  videos,
  currentVideo,
}: {
  children: React.ReactNode
  videos: Video[]
  currentVideo: UserVideo
}) => {
  const data = {
    videos,
    currentVideo,
  }
  return <VideosContext.Provider value={data}>{children}</VideosContext.Provider>
}

export const useVideos = () => {
  const value = useContext(VideosContext)
  if (!value) throw new Error("useVideos should be VideosContext")

  return value
}
