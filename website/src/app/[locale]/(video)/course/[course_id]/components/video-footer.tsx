"use client"

import { Tooltip } from "@heroui/react"
import { Button } from "@/components/ui/heroui-button"
import { useIsDebug } from "@/hooks/use-is-debug"
import { Pause, Play, SkipForward } from "lucide-react"
import { useTranslations } from "next-intl"
import ChangeProgramButton from "./change-program-button"
import SelectSceneButton from "./select-scene-button"
import SoundSlider from "./sound-slider"
import SubTitleSwitch from "./subtitle-switch"
import { useCourseStore } from "../store/course-store-provider"

type Props = {}

const VideoFooter = (props: Props) => {
  const t = useTranslations("course.course-footer")
  const [showSubtitle, toggle] = useCourseStore((state) => [state.showSubtitle, state.toggleSubtitle])
  const { playing, setPlaying } = useCourseStore((state) => ({
    playing: state.playing,
    setPlaying: state.setPlaying,
  }))
  const skipToNextQuestion = useCourseStore((state) => state.skipToNextQuestion)
  const isDebug = useIsDebug()

  const togglePlayPause = () => {
    setPlaying(!playing)
  }

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-[#252323]">
      <div className="grid grid-cols-[200px_1fr_200px] small-padding-y px-4 py-2 md:px-5 lg:px-6">
        <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <div>
                <Button
                  isIconOnly
                  variant="ghost"
                  onPress={togglePlayPause}
                  className="flex h-8 w-8 items-center justify-center"
                  aria-label={playing ? "Pause video" : "Play video"}>
                  {playing ? (
                    <Pause className="size-7 shrink-0" strokeWidth={1.2} />
                  ) : (
                    <Play className="size-7 shrink-0" strokeWidth={1.2} />
                  )}
                </Button>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content placement="top" className="text-foreground">
              {playing ? "Pause" : "Play"}
            </Tooltip.Content>
          </Tooltip>
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <div>
                <SubTitleSwitch
                  isSelected={showSubtitle}
                  onValueChange={toggle}
                  aria-label={t("subtitle-tooltip")}
                />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content placement="top" className="text-foreground">
              {t("subtitle-tooltip")}
            </Tooltip.Content>
          </Tooltip>
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <div>
                <SoundSlider />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content placement="top" className="text-foreground">
              {t("sound-tooltip")}
            </Tooltip.Content>
          </Tooltip>
        </div>

        <div className="flex items-center justify-center gap-4">
          <SelectSceneButton>{t("select-scene-button")}</SelectSceneButton>
          <ChangeProgramButton>{t("change-program-button")}</ChangeProgramButton>
        </div>
        <div className="flex items-center justify-end">
          {isDebug && (
            <Tooltip delay={0}>
              <Tooltip.Trigger>
                <div>
                  <Button
                    isIconOnly
                    variant="ghost"
                    onPress={skipToNextQuestion}
                    className="flex h-8 w-8 items-center justify-center text-green-500"
                    aria-label="Skip to next question">
                    <SkipForward className="size-7 shrink-0" strokeWidth={1.2} />
                  </Button>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content placement="top" className="text-foreground">
                Skip to next question
              </Tooltip.Content>
            </Tooltip>
          )}
        </div>
      </div>
    </footer>
  )
}

export default VideoFooter
