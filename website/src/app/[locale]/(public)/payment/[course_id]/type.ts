export interface PaymentResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: RequestBody
}

export interface Data {
  redirect_url: string
  item: Item
}

export interface Item {
  id: string
  user_id: string
  video_id: string
  transaction_id: string
  answer_average: string
  hearts: string
  total_questions: string
  correct_answers: string
  evaluation: null
  progress: string
  lang: string
  current_time: string
  last_question_id: null
  view_counter: string
  view_complete_counter: string
  is_rated: string
  price: string
  coupon_id: string
  coupon_code: string
  discount_value: string
  final_price: string
  paid: string
  outstanding_payment: string
  status: string
  certificate_url: null
  certificate_qr_code: null
  certificate_number: null
  is_certificate_generated: boolean
  deleted_at: null
  video: Video
  user: User
}

export interface User {
  id: string
  mobile: string
  first_name: null
  last_name: null
  full_name: null
  lang: string
  certificate_count: string
  email: null
  deleted_at: null
  coupons: any[]
  userVideos: UserVideo[]
}

export interface UserVideo {
  video_id: string
  slug: string
  video_title: string
  answer_average: string
  total_questions: string
  correct_answers: string
  evaluation: null
  current_time: string
  video_played: string
  coupon_code: string
  price: string
  paid: string
  certificate_url: null
  certificate_number: null
}

export interface Video {
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

export interface RequestBody {
  video_id: string
  coupon: string
}
