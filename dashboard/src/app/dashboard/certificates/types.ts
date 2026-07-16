export interface CertificatesResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: RequestBody
}

export interface Data {
  helpers: Helpers
  items: Items
}

export interface Helpers {
  introduction: Introduction
}

export interface Introduction {
  title: string
  description: string
}

export interface Items {
  data: Datum[]
  links: Links
  meta: Meta
}

export interface Datum {
  id: string
  video_url: string
  logo: string
  title: string
  description: string
  length: string
  price: string
  final_price: null
  discount: string
  view_counter: string
  view_complete_counter: string
  deleted_at: null
  certificate_url: string
  questions: Question[]
  scenes: Scene[]
  total_price: string
  total_paid: string
  total_discount: string
}

export interface Question {
  id: string
  video_id: string
  question: string
  answers_a: string
  answers_b: string
  answers_c: string
  answers_d: string
  correct_answer: string
  allowed_time: string
  appears_at: string
  wrong_answer_audio_urls: WrongAnswerAudioUrls
}

export interface WrongAnswerAudioUrls {
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
}

export interface Scene {
  id: string
  video_id: string
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
  date_from: Date
  date_to: Date
  export: boolean
}
