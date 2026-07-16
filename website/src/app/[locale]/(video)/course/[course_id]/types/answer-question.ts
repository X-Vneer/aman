import { UserVideo } from "../types"

export type TVariables = {
  video_id: string
  question_id: string
  answer: string | null
  answer_time: string
}

export interface AnswerQuestion {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: RequestBody
}

export interface Data {
  video: UserVideo
  is_correct: boolean
}

export interface RequestBody {
  video_id: string
  question_id: string
  answer: string
  answer_time: string
}
