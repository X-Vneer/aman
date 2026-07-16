export interface UserResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: null
}

export interface Data {
  item: User
}

export interface User {
  id: string
  mobile: string
  first_name: null | string
  last_name: null | string
  full_name: null | string
  lang: string
  certificate_count: string
  email: null | string
  deleted_at: null | string
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
  evaluation: null | string
  current_time: string
  video_played: string
  coupon_code: string
  price: string
  paid: string
  certificate_url: null | string
  certificate_number: null | string
  is_certificate_generated: boolean
  has_form: boolean
}
