import { cn } from "@/lib/cn"
import { Link } from "@/lib/i18n/navigation"
import { Card, Modal, useOverlayState } from "@heroui/react"
import { Button } from "@/components/ui/heroui-button"
import { ChevronUp } from "lucide-react"
import { useVideos } from "../context/courses-context"
import { useState } from "react"
import { useTranslations } from "next-intl"
import MyButton from "@/components/ui/button"
import { useParams } from "next/navigation"

type Props = {
  children: String
}

const ChangeProgramButton = (props: Props) => {
  const { course_id } = useParams()
  const modal = useOverlayState()
  const [course, setCourse] = useState("")
  const t = useTranslations("course.course-footer")
  const { videos } = useVideos()
  return (
    <>
      <Button
        onPress={modal.open}
        size="sm"
        variant="outline"
        className="small-padding-x border-primary text-primary rounded-xl! border-2 px-4 py-2 font-bold">
        <div className="flex items-center gap-7">
          <span className="small-text block ps-2 text-sm">{props.children}</span>
          <ChevronUp className={cn("duration-150", modal.isOpen && "rotate-180")} />
        </div>
      </Button>

      <Modal.Backdrop isOpen={modal.isOpen} onOpenChange={modal.setOpen}>
        <Modal.Container placement="bottom">
          <Modal.Dialog className="mx-auto w-full max-w-2xl border-0 bg-transparent p-0 shadow-none">
            {({ close }) => (
              <Modal.Body className="p-0! pb-10! shadow-none">
                <div className="flex w-full flex-row items-center justify-center gap-4">
                  {videos.map((video) => {
                    return (
                      <Card
                        key={video.id + video.title}
                        className="w-full max-w-[390px] grow cursor-pointer border-none p-0! lg:w-1/2"
                        onClick={() => {
                          if (course_id == video.id) {
                            close()
                            return
                          }
                          modal.close()
                          setCourse(video.id)
                        }}>
                        <img alt="" className="h-full w-full object-cover" src={video.logo} />
                      </Card>
                    )
                  })}
                </div>
              </Modal.Body>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
      <Modal.Backdrop
        isOpen={!!course}
        className="bg-[#0A090959] backdrop-blur-lg"
        onOpenChange={(open) => {
          if (!open) setCourse("")
        }}>
        <Modal.Container size="sm">
          <Modal.Dialog className="border-0 bg-[#0A090959] shadow-none backdrop-blur-lg">
            <Modal.Body>
              <div className="space-y-8 py-4">
                <p className="text-foreground text-center text-lg font-medium">
                  {t("change-program-confirm-dialog")}
                </p>
                <div className="flex items-center justify-center gap-5">
                  <MyButton size="sm" as={Link} href={`/course/${course}`}>
                    {t("change-program-dialog-confirm")}
                  </MyButton>
                  <MyButton
                    onClick={() => {
                      setCourse("")
                    }}
                    size="sm"
                    color="primary"
                    className="text-primary"
                    variant="outline">
                    {t("change-program-dialog-cancel")}
                  </MyButton>
                </div>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  )
}

export default ChangeProgramButton
