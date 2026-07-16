export type PermissionPaths =
  | "Overview"
  | "Website_Management"
  | "Programs:Add"
  | "Programs:Edit"
  | "Programs:Delete"
  | "Programs:Export"
  | "User:Add"
  | "User:Edit"
  | "User:Delete"
  | "User:Export"
  | "Awareness:Add"
  | "Awareness:Edit"
  | "Awareness:Delete"

export interface AdminsResponse {
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
  data: Admin[]
  links: Links
  meta: Meta
}

export interface Admin {
  id: string
  name: string
  email: string
  role_name: null
  mobile: null
  deleted_at: null
  permissions: string[]
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
