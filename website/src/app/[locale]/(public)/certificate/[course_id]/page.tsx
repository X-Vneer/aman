import { getUserVideo } from "@/app/[locale]/(video)/course/[course_id]/get-user-video"
import { timeToSeconds } from "@/app/[locale]/(video)/course/[course_id]/utils/time-to-seconds"
import { Card } from "@heroui/react"
import { Separator } from "@heroui/react"
import { getTranslations } from "next-intl/server"
import ContinueButton from "./components/continue-button"
import ShareSuccess from "./components/share-your-success"

const Page = async (props: { params: Promise<{ course_id: string }> }) => {
  const params = await props.params
  const t = await getTranslations("certificate")

  const video = await getUserVideo(params.course_id + "/lastShow")

  return (
    <section className="relative flex h-full items-center justify-center gap-4 py-8 md:py-10">
      <Card className="w-full border-none bg-[#0A090959] p-0! backdrop-blur-md">
        <Card.Content className="p-4 md:p-6 lg:p-8 rtl:text-right">
          <div className="h-full w-full shrink-0 rounded-xl px-4 py-4 sm:px-8 md:px-12 md:py-6 lg:px-24 lg:py-10">
            <div className="flex flex-col-reverse justify-center gap-8 lg:flex-row">
              <div className="space-y-6">
                <h4 className="text-center text-lg font-semibold md:text-xl lg:text-2xl">
                  {video.evaluation}
                </h4>

                <div className="flex shrink-0 items-stretch justify-center gap-2 md:gap-3 lg:gap-4">
                  <Card className="min-w-[140px] bg-[#2E2D34] p-2! md:min-w-[210px]">
                    <Card.Header className="justify-center p-3 text-xs">{t("answers")}</Card.Header>
                    <Separator />
                    <Card.Content className="space-y-3 px-4 py-3 text-center md:px-5 lg:px-6 lg:py-4">
                      <span className="text-3xl sm:text-4xl md:text-5xl">
                        {((Number(video.correct_answers) / Number(video.total_questions)) * 100).toFixed(0) +
                          "%"}
                      </span>
                      <span className="text-primary">
                        {video.correct_answers}/{video.total_questions}
                      </span>
                    </Card.Content>
                  </Card>
                  <Card className="min-w-[140px] shrink-0 bg-[#2E2D34] p-2! md:min-w-[210px]">
                    <Card.Header className="justify-center p-3 text-xs">
                      {t("average-answer-time")}
                    </Card.Header>
                    <Separator />
                    <Card.Content className="space-y-3 px-6 py-4 text-center">
                      <span className="text-3xl md:text-4xl lg:text-5xl">
                        {timeToSeconds(video.answer_average)}
                      </span>
                      <span className="text-primary">{t("sec")}</span>
                    </Card.Content>
                  </Card>
                </div>
                <ContinueButton course_id={params.course_id} />
              </div>
              <div>
                <Separator className="shrink-0 self-stretch max-lg:hidden" orientation="vertical" />
              </div>
              <ShareSuccess />
            </div>
          </div>
        </Card.Content>
      </Card>
    </section>
  )
}

export default Page
