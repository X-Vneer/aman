"use client"
import { User } from "@/app/[locale]/(public)/profile/types"
import { getUserVideo } from "@/app/[locale]/(video)/course/[course_id]/get-user-video"
import { useRouter } from "@/lib/i18n/navigation"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import CouponForm from "./coupon-form"
import Rating from "./rating"
import Stepper, { useStep } from "./stepper"
import UserInfo from "./user-info"
import Loading from "@/app/[locale]/(video)/course/[course_id]/loading"

type Props = {
  user: User
}

const Render = ({ user }: Props) => {
  const { course_id } = useParams() as { course_id: string }
  const [step, setStep] = useStep()
  const { data: video, status } = useQuery({
    queryKey: ["video", course_id],
    queryFn: async () => {
      const response = await getUserVideo(course_id + "/lastShow")
      return response
    },
    enabled: !!course_id,
  })
  const Router = useRouter()
  useEffect(() => {
    if (status === "success") {
      if (video.is_rated != "0" && step === 1) setStep(2)
    }
  }, [video?.is_rated, course_id, step, setStep, status])

  if (status === "pending") return <Loading />
  if (status === "error") return <div>Error</div>
  return (
    <>
      <Stepper totalSteps={video.has_form ? 4 : 3} />
      <section className="relative flex h-full items-center justify-center gap-4 py-8 md:py-10">
        {step === 1 && <Rating />}
        {step === 2 && <UserInfo />}
        {step === 3 && <CouponForm />}
      </section>
    </>
  )
}

export default Render
