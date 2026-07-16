import { Video } from "@/types/video"

export interface VideoResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
}

export interface Data {
  item: Video
}

export interface UserVideoResponse {
  status: boolean
  message: string
  data: {
    item: UserVideo
  }
  guard: string
  errors: null
  response_code: number
  request_body: null
}

export interface UserVideo {
  id: string
  user_id: string
  video_id: string
  answer_average: string
  hearts: string
  total_questions: string
  correct_answers: string
  progress: string
  lang: string
  evaluation?: string
  current_time: string
  last_question_id: null
  view_counter: string
  view_complete_counter: string
  is_rated: string
  status: string
  certificate_url: null | string
  certificate_qr_code: null | string
  certificate_number: null | string
  is_certificate_generated: boolean
  deleted_at: null
  video: Video
  has_form: boolean
  user: User
}

export interface User {
  id: string
  mobile: string
  first_name: null
  last_name: null
  full_name: null
  lang: string
  email: null
  deleted_at: null
}
