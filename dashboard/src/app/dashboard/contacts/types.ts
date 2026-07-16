import { contactStatus } from "./components/table"
export interface ContactsResponse {
  status: boolean
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
  data: Contact[]
  links: Links
  meta: Meta
}

export interface Contact {
  id: string
  type: "Suggestion" | "Complaint" | "Inquiry"
  name: string
  email: string
  mobile: string
  subject: string
  message: string
  images: string[] | null
  reply: null | string
  video_title: null | string
  deleted_at: null
  created_at: string
  status: keyof typeof contactStatus
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
}
