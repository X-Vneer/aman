import { Video as PublicVideo } from "@/types/public-videos-response"
export interface Video extends PublicVideo {
  questions: Question[]
  scenes: Scene[]
}

export interface Question {
  id: string
  video_id: string
  question: string
  answers_a: string
  answers_b: string
  answers_c: string
  answers_d: string
  wrong_a: string
  wrong_b: string
  wrong_c: string
  wrong_d: string
  correct_answer: string
  allowed_time: string
  appears_at: string
}

export interface Scene {
  id: string
  video_id: string
  logo: string
  start_time: string
  length: string
  end_time: string
}
