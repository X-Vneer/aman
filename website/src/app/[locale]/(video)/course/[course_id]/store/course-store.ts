// src/stores/counter-store.ts
import { Question, Scene } from "@/types/video"
import { createStore } from "zustand/vanilla"
import { UserVideo } from "../types"
import { timeToSeconds } from "../utils/time-to-seconds"

export type VideoStatus = {
  correctlyAnsweredQuestions: string
  hearts: string
  answerRate: string
  progress: string
  startTime: string
}

export type AnswerStatus = "pending" | "correct" | "wrong" | "timeout"
export type CourseState = {
  video: UserVideo
  playing: boolean
  scenesMap: Map<string, Scene>
  questionsMap: Map<string, Question>
  currentQuestion: string
  lastQuestion: string
  volume: number
  totalQuestions: string
  selectedAnswer: string
  answerStatus: AnswerStatus
  showExplanation: boolean
  videoPlayerRef: HTMLVideoElement | null
  showSubtitle: boolean
  /** Persisted so ReactPlayer light/preview does not reset on remount (e.g. Strict Mode). */
  lightPreviewDismissed: boolean
} & VideoStatus

export type CourseActions = {
  setCurrentQuestion: (question: string) => void
  removeCurrentQuestion: () => void
  skipToNextQuestion: () => void
  setAnswerRate: (arg: string) => void
  setAnswerStatus: (arg: AnswerStatus) => void
  setProgress: (arg: string) => void
  setSelectedAnswer: (arg: string) => void
  updateVideoStatus: (arg: Partial<VideoStatus>) => void
  changeVolume: (arg: number) => void
  setShowExplanation: (arg: boolean) => void
  setVideoPlayerRef: (arg: HTMLVideoElement | null) => void
  toggleSubtitle: (arg: boolean) => void
  setPlaying: (arg: boolean) => void
  setLightPreviewDismissed: (arg: boolean) => void
}

export type CourseStore = CourseState & CourseActions

export const createCourseStore = (initState: CourseState) => {
  return createStore<CourseStore>()((set) => ({
    ...initState,
    setCurrentQuestion: (currentQuestion) =>
      set((state) => ({ currentQuestion, lastQuestion: currentQuestion, playing: false })),
    removeCurrentQuestion: () =>
      set((state) => ({
        currentQuestion: "",
        selectedAnswer: "",
        answerStatus: "pending",
        showExplanation: false,
        playing: true,
      })),
    skipToNextQuestion: () =>
      set((state) => {
        const currentTime = state.videoPlayerRef?.currentTime ?? 0
        const questionTimes = Array.from(state.questionsMap.keys())
          .map((key) => ({ key, seconds: timeToSeconds(state.questionsMap.get(key)!.appears_at) }))
          .sort((a, b) => a.seconds - b.seconds)

        const nextQ = questionTimes.find((q) => q.seconds > Math.ceil(currentTime))
        if (nextQ && state.videoPlayerRef) {
          state.videoPlayerRef.currentTime = nextQ.seconds - 1
          return { playing: true }
        }
        return {}
      }),
    setVideoPlayerRef: (ref) => set({ videoPlayerRef: ref }),
    setSelectedAnswer: (arg) => set(() => ({ selectedAnswer: arg })),
    setAnswerRate: (arg) => set(() => ({ answerRate: arg })),
    setProgress: (arg) => set(() => ({ progress: arg })),
    setAnswerStatus: (arg) => set(() => ({ answerStatus: arg })),
    setShowExplanation: (arg) => set(() => ({ showExplanation: arg })),
    updateVideoStatus(arg) {
      set({ ...arg })
    },
    changeVolume(arg) {
      set({ volume: arg })
    },
    toggleSubtitle(arg) {
      set({ showSubtitle: arg })
    },
    setPlaying(arg) {
      set({ playing: arg })
    },
    setLightPreviewDismissed: (lightPreviewDismissed) => set({ lightPreviewDismissed }),
  }))
}
