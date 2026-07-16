/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/heroui-button"
import useForceLandscape from "@/hooks/use-force-landscape"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { EventData, Joyride, STATUS, TooltipRenderProps } from "react-joyride"
import allSteps from "./steps"

function Tooltip({ controls, step, tooltipProps }: TooltipRenderProps) {
  const t = useTranslations("tour")

  const data = step.data as {
    icon: string
    index: number
  }

  return (
    <>
      <div
        {...tooltipProps}
        className="flex w-screen max-w-80! flex-col gap-8 rounded-lg bg-[#241c1c] p-4 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#120A09] [box-shadow:7px_4px_16px_#30ACFF17]">
            <img alt="icon" src={data.icon} />
          </div>

          <div className="flex items-center gap-1">
            {Array(7)
              .fill("")
              .map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${i + 1 == data.index ? "bg-primary" : "bg-default-500"}`}
                />
              ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-foreground text-lg font-medium">{t(`steps.${step.title as "step1"}.title`)}</p>
          <p className="text-default-500 text-sm">{t(`steps.${step.title as "step1"}.content`)}</p>
        </div>
        <div className="flex justify-between gap-4 px-4">
          <Button
            onPress={() => {
              controls.skip()
              window.localStorage.setItem("aman-tour-completed", "true")
            }}
            size="sm"
            variant="outline"
            fullWidth>
            {t("buttons.skip")}
          </Button>

          <Button
            onPress={() => {
              controls.next()
            }}
            variant="primary"
            size="sm"
            fullWidth>
            {t("buttons.next")}
          </Button>
        </div>
      </div>
    </>
  )
}
export function CustomJOYRIDE() {
  const [run, setRun] = useState(false)

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data
    const options: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (options.includes(status)) {
      setRun(false)
      if (typeof window !== "undefined") {
        window.localStorage.setItem("aman-tour-completed", "true")
      }
    }
  }

  const isLandscape = useForceLandscape()
  useEffect(() => {
    if (typeof window !== "undefined" && isLandscape) {
      if (!window.localStorage.getItem("aman-tour-completed")) {
        window.innerWidth > window.innerHeight ? setRun(true) : null
      }
    }
  }, [isLandscape])

  return (
    <div>
      <Joyride
        onEvent={handleJoyrideCallback}
        run={run}
        continuous
        scrollToFirstStep
        steps={allSteps}
        styles={{
          overlay: {
            backgroundColor: "#030303D4",
          },
        }}
        tooltipComponent={Tooltip}
        options={{
          overlayClickAction: false,
          arrowColor: "#241c1c",
          zIndex: 2000000,
          buttons: ["back", "close", "primary", "skip"],
        }}
      />
    </div>
  )
}
