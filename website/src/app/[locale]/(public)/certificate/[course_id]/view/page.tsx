import { getUserVideo } from "@/app/[locale]/(video)/course/[course_id]/get-user-video"
import Certificate from "@/components/common/certificate"
import { Card } from "@heroui/react"

export const dynamic = "force-dynamic"
const Page = async (props: { params: Promise<{ course_id: string }> }) => {
  const params = await props.params
  const video = await getUserVideo(params.course_id + "/lastShow")
  return (
    <Card
      className="mx-auto mb-20 flex h-full w-full max-w-3xl shrink-0 items-center justify-center gap-4 rounded-xl bg-[#0A090959] p-1 py-8 md:py-10">
      <Certificate certificate_qr_code={video.certificate_number!} />
    </Card>
  )
}

export default Page
