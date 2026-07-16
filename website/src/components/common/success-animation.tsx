"use client"
import successAnimation from "@/assets/success-animation.json"
import Lottie from "lottie-react"

const SuccessAnimation = () => {
  return <Lottie className="mx-auto w-52" loop={false} animationData={successAnimation} />
}

export default SuccessAnimation
