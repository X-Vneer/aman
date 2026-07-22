export interface AwarenessResponse {
  status: boolean
  local: string
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: RequestBody
}

export interface Data {
  helpers: null
  items: Items
}

export interface Items {
  data: Awareness[]
  links: Links
  meta: Meta
}

export interface Awareness {
  id: string
  video_id: string
  video_title: string
  title: string
  description: string
  symptoms: string[]
  created_at: string
  updated_at: string
  deleted_at: null
  video: Video
}

export interface Video {
  id: string
  video_url: string
  logo: string
  title: string
  description: string
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
  title: string
  logo: string
  start_time: string
  length: string
  end_time: string
}

export interface Links {
  first: string
  last: string
  prev: null
  next: null
}

export interface Meta {
  current_page: number
  from: number
  last_page: number
  links: Link[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface Link {
  url: null | string
  label: string
  active: boolean
}

export interface RequestBody {
  per_page: number
  page: number
  sort_column: string
  sort_direction: string
  date_from: string
  date_to: string
  dateFrom: string
  dateTo: string
}
