import AmanApi from "@/services/aman"
import { ReviewsResponse } from "./types"

export const GetReviews = async (params: URLSearchParams) => {
  const response = await AmanApi.get<ReviewsResponse>(`/rates`, {
    params,
  })
  return response.data.data
}
