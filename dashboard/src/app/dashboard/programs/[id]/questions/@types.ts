import { Langs } from "../../add/@types"

export interface Question {
  question: Langs
  answers_a: Langs
  answers_b: Langs
  answers_c: Langs
  wrong_a: Langs
  wrong_b: Langs
  wrong_c: Langs
  correct_answer: string
  allowed_time: string
  appears_at: Langs
  wrong_answer_audio_urls: WrongAnswerAudioUrls | null
}

export interface WrongAnswerAudioUrls {
  ar: {
    answer_a: string
    answer_b: string
    answer_c: string
  }
  en: {
    answer_a: string
    answer_b: string
    answer_c: string
  }
}
