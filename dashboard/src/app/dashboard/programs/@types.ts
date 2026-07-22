import { Langs } from "./add/@types"

export interface VideoResponse {
  status: boolean
  local: string
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: null
}

export interface Data {
  item: Item
}

export interface Item {
  id: string
  video_url: Langs
  logo: string
  title: Langs
  description: Langs
  length: string
  color: string
  view_counter: string
  view_complete_counter: string
  deleted_at: null
  questions: Question[]
  scenes: Scene[]
}

export interface Question {
  id: string
  video_id: string
  question: Langs
  answers_a: Langs
  answers_b: Langs
  answers_c: Langs
  answers_d: Langs
  wrong_a: Langs
  wrong_b: Langs
  wrong_c: Langs
  wrong_d: Langs
  correct_answer: string
  allowed_time: string
  appears_at: Langs
}

export interface Scene {
  id: string
  video_id: string
  title: Langs
  logo: string
  start_time: string
  length: string
  end_time: string
}

export interface SceneResponse {
  status: boolean
  local: string
  message: string
  data: {
    item: Scene
  }
  guard: string
  errors: null
  response_code: number
  request_body: null
}
export interface QuestionResponse {
  status: boolean
  local: string
  message: string
  data: {
    item: Question
  }
  guard: string
  errors: null
  response_code: number
  request_body: null
}
