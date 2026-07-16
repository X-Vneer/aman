import { AmanApiGuest } from "@/services/aman"

export interface UploadFileResponse {
  status: boolean
  message: string
  data: {
    relativePath: string
    absolutePath: string
  }
  guard: string
  errors: null
  response_code: number
}

export const UploadFile = async (file: File, path: string) => {
  // Ensure we're only sending to API backend, never writing to Next.js filesystem
  if (typeof window === 'undefined') {
    throw new Error('File uploads can only be initiated from the client side. Files must be sent to the API backend, not written to Next.js filesystem.')
  }

  // Validate file size (additional client-side check)
  const maxSize = 32 * 1024 * 1024 // 32MB
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`)
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("path", path)
  
  // Always send to API backend, never write to Next.js filesystem
  const response = await AmanApiGuest.post<UploadFileResponse>("/uploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data.data
}

