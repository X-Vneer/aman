import { download } from "@/assets/icons"
import { Step } from "react-joyride"
import { step1, step2, step3, step4, step5, step6, step7 } from "@/assets/icons"

const steps: Step[] = [
  {
    title: "step1",
    content: "step1",
    data: {
      icon: step1.src,
      index: 1,
    },
    skipBeacon: true,
    target: "#step1",
  },
  {
    title: "step2",
    content: "step2",
    data: {
      icon: step2.src,
      index: 2,
    },
    beaconPlacement: "bottom" as const,
    target: "#step2",
  },
  {
    title: "step3",
    content: "step3",
    data: {
      icon: step3.src,
      index: 3,
    },
    beaconPlacement: "bottom" as const,
    target: "#step3",
  },
  {
    title: "step4",
    content: "step4",
    data: {
      icon: step4.src,
      index: 4,
    },
    beaconPlacement: "bottom" as const,
    target: "#step4",
  },
  {
    title: "step5",
    content: "step5",
    data: {
      icon: step5.src,
      index: 5,
    },
    placement: "center",
    target: "body",
  },
  {
    title: "step6",
    content: "step6",
    data: {
      icon: step6.src,
      index: 6,
    },
    placement: "center",
    target: "body",
  },
  {
    title: "step7",
    content: "step7",
    data: {
      icon: step7.src,
      index: 7,
    },
    placement: "center",
    target: "body",
  },
]
export default steps
