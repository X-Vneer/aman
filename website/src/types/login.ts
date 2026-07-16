export interface LoginResponse {
  status: boolean
  message: string
  data: {
    token: string
    timeout_audio: string
    item: User
  }
  guard: null
  errors: null
  response_code: number
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
