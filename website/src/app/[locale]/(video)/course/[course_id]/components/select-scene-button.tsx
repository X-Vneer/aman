import { cn } from "@/lib/cn"
import { Card, Modal, useOverlayState } from "@heroui/react"
import { Button } from "@/components/ui/heroui-button"
import { ChevronUp } from "lucide-react"
import { useVideos } from "../context/courses-context"
import { useCourseStore } from "../store/course-store-provider"
import { timeToSeconds } from "../utils/time-to-seconds"
import { Scene } from "@/types/video"
type Props = {
  children: String
}

const SelectSceneButton = (props: Props) => {
  const state = useOverlayState()
  const { currentVideo } = useVideos()
  const { videoPlayerRef, updateVideoState } = useCourseStore((state) => ({
    videoPlayerRef: state.videoPlayerRef,
    updateVideoState: state.updateVideoStatus,
  }))
  const scenes = currentVideo.video.scenes
  const hasPassedCourse = currentVideo.certificate_number ? true : false

  const handleSelectScene = (scene: Scene) => {
    if (!hasPassedCourse) return
    updateVideoState({ startTime: scene.start_time })
    if (videoPlayerRef) {
      videoPlayerRef.currentTime = timeToSeconds(scene.start_time)
    }
  }
  return (
    <>
      <Button
        onPress={state.open}
        size="sm"
        variant="outline"
        className="small-padding-x border-primary text-primary rounded-xl! border-2 px-4 py-2 font-bold">
        <div className="flex items-center gap-7">
          <span className="small-text block ps-2 text-sm">{props.children}</span>
          <ChevronUp className={cn("duration-150", state.isOpen && "rotate-180")} />
        </div>
      </Button>
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="bottom">
          <Modal.Dialog className="mx-auto w-full max-w-5xl border-0 bg-transparent p-0 shadow-none">
            <Modal.Body className="p-0! pb-10! shadow-none">
              <div className="flex w-full flex-row items-center justify-center gap-4">
                {scenes.map((scene) => {
                  return (
                    <Card
                      key={scene.id}
                      className="w-full max-w-[390px] grow cursor-pointer border-none p-0!"
                      onClick={() => {
                        handleSelectScene(scene)
                      }}>
                      <img alt="" className="h-full w-full object-cover" src={scene.logo} />
                    </Card>
                  )
                })}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  )
}

export default SelectSceneButton
