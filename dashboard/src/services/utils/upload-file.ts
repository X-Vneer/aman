export interface UploadFileResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: RequestBody
}

export interface Data {
  relativePath: string
  absolutePath: string
}

export interface RequestBody {
  path: string
  file: File
}
import AmanApi from "@/services/aman"
import { objectToFormData } from "@/utils/obj-to-formdata"

export const UploadFile = async (data: { file: File; path: string }) => {
  const response = await AmanApi.post<UploadFileResponse>("/uploadFile", objectToFormData(data))
  return response.data.data
}
