export interface VideoColorsResponse {
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
  items: Items
}

export interface Items {
  id: { [key: string]: string }
  en: { [key: string]: string }
  ar: { [key: string]: string }
}
