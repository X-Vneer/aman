"use client"

import { useSearchParams } from "next/navigation"

import SendOTP from "./send-otp"
import Success from "./success"
import VerifyOTP from "./verify-opt"

const Wrapper = () => {
  const searchParams = useSearchParams()
  const mobile = searchParams.get("mobile")
  const success = searchParams.get("success")

  return success ? <Success /> : mobile ? <VerifyOTP /> : <SendOTP />
}

export default Wrapper
