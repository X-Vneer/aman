// src/providers/counter-store-provider.tsx
"use client"

import { type ReactNode, createContext, useContext, useRef } from "react"
import { useStore } from "zustand"
import { useShallow } from "zustand/react/shallow"

import { UserVideo } from "../types"
import { arrayToMapByKey } from "../utils/array-to-map-by-key"
import { CourseState, CourseStore, createCourseStore } from "./course-store"
import { timeToSeconds } from "../utils/time-to-seconds"

export type CourseStoreApi = ReturnType<typeof createCourseStore>

export const CourseStoreContext = createContext<CourseStoreApi | undefined>(undefined)

export interface CourseStoreProviderProps {
  children: ReactNode
  video: UserVideo
}

export const CourseStoreProvider = ({ children, video }: CourseStoreProviderProps) => {
  console.log("🚀 ~ CourseStoreProvider ~ video:", video)
  const storeRef = useRef<CourseStoreApi>(null)
  if (!storeRef.current) {
    const scenesMap = arrayToMapByKey(video.video.scenes, "start_time")
    const questionsMap = arrayToMapByKey(video.video.questions, "appears_at")
    const initialState: CourseState = {
      video,
      scenesMap,
      questionsMap,
      currentQuestion: "",
      playing: true,
      lastQuestion: timeToSeconds(video.current_time) + "" || "00:00:00",
      totalQuestions: video.total_questions,
      correctlyAnsweredQuestions: video.correct_answers,
      hearts: video.hearts,
      answerRate: video.answer_average || "00:00:00",
      progress: video.progress,
      volume: 0.5,
      selectedAnswer: "",
      answerStatus: "pending",
      showExplanation: false,
      videoPlayerRef: null,
      showSubtitle: false,
      lightPreviewDismissed: false,
      // if user has completed a course he should start from start by default
      startTime: video.certificate_number ? "00:00:00" : video.current_time,
    }

    storeRef.current = createCourseStore(initialState)
  }

  return <CourseStoreContext.Provider value={storeRef.current}>{children}</CourseStoreContext.Provider>
}

export const useCourseStore = <T,>(selector: (store: CourseStore) => T): T => {
  const courseStoreContext = useContext(CourseStoreContext)

  if (!courseStoreContext) {
    throw new Error(`useCourseStore must be used within CourseStoreProvider`)
  }

  return useStore(courseStoreContext, useShallow(selector))
}
