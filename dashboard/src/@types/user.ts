export interface LoginResponse {
  status: boolean
  message: string
  data: User
  guard: null
  errors: null
  response_code: number
  request_body: RequestBody
}

export interface User {
  token: string
  item: Item
}

export interface Item {
  id: string
  name: string
  email: string
  permissions: string[]
  role_name: "Admin" | "User"
  deleted_at: null
}

export interface RequestBody {
  email: string
  otp: string
}
