import AmanApi from "@/services/aman"

type Args = {
  mobile: string
}

const PostSendOTP = async (args: Args) => {
  const response = await AmanApi.post("/guest/user/loginRegisterResendOtp", args)
  console.log("🚀 ~ PostSendOTP ~ response:", response)
}

export default PostSendOTP
