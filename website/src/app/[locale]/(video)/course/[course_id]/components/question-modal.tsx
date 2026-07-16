"use client"
import CountDown from "@/components/common/count-down"
import { useIsDebug } from "@/hooks/use-is-debug"
import useMutation from "@/hooks/use-mutation"
import { baseURL } from "@/services/aman"
import { Modal } from "@heroui/react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { ComponentRef, useEffect, useMemo, useRef, useState } from "react"
import type ReactCountdown from "react-countdown"
import { useVideos } from "../context/courses-context"
import { useCourseStore } from "../store/course-store-provider"
import { AnswerQuestion, TVariables } from "../types/answer-question"
import { answerQuestion } from "../utils/answer-question"
import { formatTime } from "../utils/format-time"
import { shuffleArray } from "../utils/shuffle-array"
import { timeToSeconds } from "../utils/time-to-seconds"
import Answer from "./answer"
import ErrorAlert from "./error-alert"
import WrongAnswerExplanation from "./wrong-answer-explanation"

const QuestionModal = () => {
  // state

  const { course_id, locale } = useParams() as { course_id: string; locale: string }
  const { currentVideo } = useVideos()
  const hasPassedCourse = currentVideo.certificate_qr_code ? true : false

  const t = useTranslations("course.error-alert")
  const isDebug = useIsDebug()
  const {
    currentQuestion: current,
    questionsMap: questions,
    selectedAnswer,
    answerStatus,
    setSelectedAnswer,
    updateVideoStatus,
    removeCurrentQuestion: next,
    setAnswerStatus,
    showExplanation,
    setShowExplanation,
  } = useCourseStore((state) => state)
  const question = questions.get(current)

  // counter
  const countDownRef = useRef<ReactCountdown | null>(null)
  // const [isTimeOut, setIsTimeOut] = useState(false)
  const [counter, setCounter] = useState("0")

  // error state
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [showError, setShowError] = useState(false)

  const timeoutAudioRef = useRef<ComponentRef<"audio">>(null)
  const timeoutDate = useMemo(
    () => Date.now() + timeToSeconds(question?.allowed_time || "0") * 1000,
    [question?.id, counter, question?.allowed_time],
  )

  // answering question

  type TError = unknown
  const handleAnsweringQuestionOnWithCertificate = async (data: TVariables) => {
    return { is_correct: data.answer === question?.correct_answer }
  }

  const { mutate, isLoading, isSuccess } = useMutation<
    AnswerQuestion["data"] | { is_correct: boolean },
    TError,
    TVariables
    //? if course has been passed no need to do a server request to check {{a}} is always right
  >(
    hasPassedCourse
      ? handleAnsweringQuestionOnWithCertificate
      : async (variables) => {
          setAnswerStatus(variables.answer === question?.correct_answer ? "correct" : "wrong")

          return await answerQuestion(variables)
        },
    {
      onSuccess(data) {
        if (!hasPassedCourse) {
          let result = data as AnswerQuestion["data"]
          updateVideoStatus({
            correctlyAnsweredQuestions: result.video.correct_answers,
            hearts: result.video.hearts,
            answerRate: result.video.answer_average,
            progress: result.video.progress,
          })
        }

        const status = data.is_correct ? "correct" : "wrong"
        setAnswerStatus(status)

        if (isDebug && status === "correct") {
          next()
        }
      },
      onError(error) {
        // Handle error response
        let serverMessage = ""

        if (axios.isAxiosError(error) && error.response?.data) {
          const errorData = error.response.data as {
            message?: string
            errors?: Record<string, string[]>
          }

          if (errorData.message) {
            serverMessage = errorData.message
          } else if (errorData.errors) {
            const firstErrorKey = Object.keys(errorData.errors)[0]
            if (firstErrorKey && errorData.errors[firstErrorKey]?.[0]) {
              serverMessage = errorData.errors[firstErrorKey][0]
            }
          }
        }

        setErrorMessage(serverMessage)
        setShowError(true)
        setAnswerStatus("pending") // Reset answer status
        setSelectedAnswer("") // Reset selected answer
      },
    },
  )
  // closing question modal after answering
  useEffect(() => {
    if (!isSuccess) return
    if (isDebug && answerStatus === "correct") return

    let timer: NodeJS.Timeout
    if (answerStatus === "correct") {
      timer = setTimeout(
        () => {
          next()
        },
        hasPassedCourse ? 1500 : 0,
      )
    }

    if (answerStatus === "wrong") {
      timer = setTimeout(
        () => {
          setShowExplanation(true)
        },
        isDebug ? 0 : hasPassedCourse ? 1500 : 0,
      )
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isSuccess, answerStatus, next, setShowExplanation, isDebug])

  // handling answering
  const handleAnswering = (answer: string) => {
    setSelectedAnswer(answer)
    countDownRef.current?.api?.pause()
    const timeInSec = (Date.now() + timeToSeconds(question?.allowed_time || "0") * 1000 - timeoutDate) / 1000
    mutate({
      video_id: course_id,
      question_id: question!.id,
      answer,
      answer_time: formatTime(timeInSec),
    })
  }

  // handling timeout
  const handleTimeout = () => {
    // if (!question) return
    setCounter(Math.random() + Math.random() + "")
    // mutate({
    //   video_id: course_id,
    //   question_id: question!.id,
    //   answer: null,
    //   answer_time: question!.allowed_time,
    // })
  }

  useEffect(() => {
    if (question?.allowed_time === "00:00:00") return
    let timer = setTimeout(
      () => {
        if (!question?.id) return
        timeoutAudioRef.current?.play()
      },
      timeToSeconds(question?.allowed_time || "0") * 1000 - 5000,
    )

    return () => {
      clearTimeout(timer)
    }
  }, [question?.id, question?.allowed_time, counter])

  // shuffle answer in production
  const shuffledAnswers = useMemo(() => {
    return process.env.NODE_ENV === "development"
      ? (["a", "b", "c", "d"] as const)
      : shuffleArray(["a", "b", "c", "d"] as const)
  }, [question?.id])

  // const randomValue = useMemo(() => Math.random() + "", [question?.id])

  return (
    <>
      <ErrorAlert isOpen={showError} errorMessage={errorMessage} onClose={() => setShowError(false)} />
      <Modal.Backdrop
        isDismissable={false}
        isOpen={!!question}
        onOpenChange={(open) => {
          if (!open) next()
        }}>
        <Modal.Container scroll="outside" size="lg">
          <Modal.Dialog className="overflow-hidden rounded-xl bg-[#0a090970] px-2 py-5 shadow-none backdrop-blur-2xl duration-300 md:px-3 md:py-6 lg:px-4 lg:py-9">
            <AnimatePresence mode="wait">
              {showExplanation ? (
                <motion.div
                  key="explanation"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}>
                  <Modal.Body className="space-y-6 overflow-visible p-0 shadow-none lg:space-y-8">
                    <WrongAnswerExplanation question={question!} answer={selectedAnswer} />
                  </Modal.Body>
                </motion.div>
              ) : (
                <motion.div key="question" exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}>
                  <Modal.Body className="space-y-6 p-0 shadow-none lg:space-y-8">
                    <p className="text-center text-2xl text-white">{question?.question}</p>
                    <div className="flex flex-col gap-2">
                      {shuffledAnswers.map((key) => {
                        return (
                          <Answer
                            status={`answer_${key}` === selectedAnswer ? answerStatus : "pending"}
                            isLoading={isLoading}
                            isDebugCorrect={isDebug && `answer_${key}` === question?.correct_answer}
                            onClick={() => {
                              if (isLoading || answerStatus !== "pending") return
                              handleAnswering(`answer_${key}`)
                            }}
                            key={key}
                            answer={question?.[`answers_${key}`] || ""}
                          />
                        )
                      })}
                    </div>
                    <div>
                      <CountDown
                        ref={countDownRef}
                        key={question?.appears_at + "" + counter}
                        alert
                        onComplete={() => {
                          if (answerStatus === "pending") handleTimeout()
                        }}
                        className="rounded-full"
                        date={timeoutDate}
                        result={
                          <div>
                            <p className="text-danger">00:00</p>
                          </div>
                        }
                      />
                      <audio preload="auto" ref={timeoutAudioRef} src={`${baseURL}/timeout/${locale}.mp3`} />
                    </div>
                  </Modal.Body>
                </motion.div>
              )}
            </AnimatePresence>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  )
}

export default QuestionModal
