import { Card } from "@heroui/react"
import { Separator } from "@heroui/react"

import { redirect } from "@/lib/i18n/navigation"

import { loginBackground } from "@/assets"
import BackgroundImage from "@/components/common/background-image"
import { auth } from "@/lib/auth/auth"
import AmanApi from "@/services/aman"
import { SuccessResponse } from "@/types"
import { Video } from "@/types/public-videos-response"
import ChooseMethod from "./components/choose-method"
import CourseDetails from "./components/course-details"
import Failure from "./components/failure"
import Success from "./components/success"

type Props = {
  params: Promise<{ course_id: string; locale: string }>
  searchParams: Promise<Record<string, string>>
}

const Page = async (props: Props) => {
  const searchParams = await props.searchParams
  const params = await props.params

  const { course_id, locale } = params

  const session = await auth()
  if (!session) {
    redirect({
      href: {
        pathname: "/login",
        query: {
          callbackUrl: `/payment/${course_id}`,
        },
      },
      locale: locale,
    })
  }
  const response = await AmanApi.get<SuccessResponse<Video>>(`/user/videos/${course_id}`, {
    params: { coupon: searchParams.coupon || "" },
  })
  const course = response.data.data.item

  const successParam = searchParams.success
  const message =
    searchParams.message != null && searchParams.message !== ""
      ? decodeURIComponent(searchParams.message)
      : null

  if (successParam === "1")
    return (
      <>
        <BackgroundImage src={course.logo} />
        <section className="flex h-full items-center justify-center gap-4 py-8 md:py-10">
          <Card className="w-full max-w-sm border-none bg-[#0A090959] p-0! backdrop-blur-md">
            <Card.Content className="p-8 rtl:text-right">
              <Success course_id={course_id} locale={locale} message={message} />
            </Card.Content>
          </Card>
        </section>
      </>
    )

  if (successParam === "0")
    return (
      <>
        <BackgroundImage src={course.logo} />
        <section className="flex h-full items-center justify-center gap-4 py-8 md:py-10">
          <Card className="w-full max-w-sm border-none bg-[#0A090959] p-0! backdrop-blur-md">
            <Card.Content className="p-8 rtl:text-right">
              <Failure course_id={course_id} locale={locale} message={message} />
            </Card.Content>
          </Card>
        </section>
      </>
    )

  return (
    <>
      <BackgroundImage src={course.logo} />
      <section className="relative flex h-full items-center justify-center gap-4 py-8 md:py-10">
        <Card className="w-full max-w-4xl border-none bg-[#0A090959] p-0! backdrop-blur-md">
          <Card.Content className="border-none px-4 py-8 md:px-8 md:py-10 lg:py-12 rtl:text-right">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full md:w-1/2">
                <CourseDetails course={course} />
              </div>
              <div>
                <Separator className="hidden md:block" orientation="vertical" />
                <Separator className="md:hidden" />
              </div>
              <div className="w-full md:w-1/2">
                <ChooseMethod />
              </div>
            </div>
          </Card.Content>
        </Card>
      </section>
    </>
  )
}

export default Page
