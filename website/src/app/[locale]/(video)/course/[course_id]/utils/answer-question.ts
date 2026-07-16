import AmanApi from "@/services/aman"
import { AnswerQuestion, TVariables } from "../types/answer-question"

export const answerQuestion = async (data: TVariables) => {
  const response = await AmanApi.post<AnswerQuestion>(`/user/user-videos/check-answer`, data)
  return response.data.data
}
