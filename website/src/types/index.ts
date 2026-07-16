import { SVGProps } from "react"

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type ErrorResponse<T> = {
  message: string
  errors?: {
    [key in keyof T]?: string[]
  }
}

export type SuccessResponse<T> = {
  status: true
  message: string
  data: {
    item: T
  }
  guard: string
  errors: null
  response_code: number
}
