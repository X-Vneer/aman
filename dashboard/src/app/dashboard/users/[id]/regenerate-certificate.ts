import AmanApi from "@/services/aman"

export async function regenerateCertificate(certificateNumber: string) {
  const { data } = await AmanApi.post(
    `/user-videos/${encodeURIComponent(certificateNumber)}/regenerate-certificate`,
  )
  return data
}
