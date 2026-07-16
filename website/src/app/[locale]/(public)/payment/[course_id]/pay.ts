import AmanApi from "@/services/aman"
import { PaymentResponse } from "./type"

type Args = {
  video_id: string
  coupon?: string
}
export const Pay = async (data: Args) => {
  const paymentResponse = await AmanApi.post<PaymentResponse>(`/user/user-videos`, data)
  return paymentResponse.data
}
