import AmanApi from "@/services/aman"

export async function revokeCertificateIssuance(userVideoId: number) {
  const { data } = await AmanApi.post(`/user-videos/${userVideoId}/revoke-certificate`)
  return data
}
