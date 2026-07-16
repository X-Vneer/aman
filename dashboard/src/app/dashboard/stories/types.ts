export interface StoriesResponse {
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
  data: Story[]
  links: Links
  meta: Meta
}

export interface Story {
  id: string
  first_name: string
  last_name: string
  full_name: string
  title: string
  mobile: string
  email: string
  video_id: string
  video_title: string
  content: string
  created_at: string
  updated_at: string
  deleted_at: null
  is_active: boolean
  has_video: boolean
  age: string
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
