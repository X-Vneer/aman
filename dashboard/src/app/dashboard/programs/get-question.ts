import AmanApi from "@/services/aman"
import { QuestionResponse } from "./@types"

export const GetQuestion = async ({ id }: { id: string }) => {
  const response = await AmanApi.get<QuestionResponse>(`/questions/${id}/edit`)
  return response
}
