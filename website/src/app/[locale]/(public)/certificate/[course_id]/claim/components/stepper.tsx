"use client"
import { cn } from "@/lib/cn"
import { Card, ProgressBar } from "@heroui/react"
import { useTranslations } from "next-intl"
import { parseAsNumberLiteral, useQueryState } from "nuqs"

interface StepperProps {
  totalSteps?: 3
  currentStep?: number
}

export const useStep = () => {
  return useQueryState(
    "step",
    parseAsNumberLiteral([1, 2, 3, 4]).withDefault(1).withOptions({ history: "replace" }),
  )
}
const Stepper = ({ totalSteps = 3, currentStep }: StepperProps) => {
  const [step] = useStep()

  // Use currentStep prop if provided, otherwise use URL query state
  const activeStep = currentStep || step

  const t = useTranslations("rating.stepper")

  // Calculate progress percentage based on total steps
  const getProgressValue = (current: number, total: number) => {
    if (current === 1) return 0
    if (current >= total) return 100
    return ((current - 1) / (total - 1)) * 100
  }

  const stepPositions = [
    { position: "ltr:left-6 rtl:right-6", transform: "" },
    { position: "ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2", transform: "" },
    { position: "ltr:right-6 rtl:left-6", transform: "" },
  ]
  const stepLabels = [t("first"), t("second"), t("third")]
  const gridCols = "grid-cols-3"

  return (
    <Card className="mx-auto mb-5 max-w-md rounded-xl bg-[#0A090959] px-5 py-8 backdrop-blur-xl">
      <div className="relative mb-6 px-8">
        <ProgressBar
          aria-label="Step progress"
          className="w-full rtl:rotate-180"
          size="sm"
          value={getProgressValue(activeStep, totalSteps)}
          color="accent">
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>

        {stepPositions.map((pos, index) => (
          <p
            key={index}
            className={cn(
              "bg-primary absolute -top-1 flex size-5 items-center justify-center rounded-full text-xs text-black duration-300",
              pos.position,
              activeStep >= index + 1 && "origin-center scale-110",
            )}>
            {activeStep >= index + 1 && index + 1}
          </p>
        ))}
      </div>

      <div className={cn("grid w-full", gridCols)}>
        {stepLabels.map((label, index) => (
          <p
            key={index}
            className={cn(
              "text-default-500 text-sm",
              index === 0 && "",
              index > 0 && index < stepLabels.length - 1 && "text-center",
              index === stepLabels.length - 1 && "text-end",
              activeStep === index + 1 && "text-white",
            )}>
            {label}
          </p>
        ))}
      </div>
    </Card>
  )
}

export default Stepper
