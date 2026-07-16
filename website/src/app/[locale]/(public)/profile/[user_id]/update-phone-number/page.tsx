import { Card } from "@heroui/react"
import { Suspense } from "react"
import Wrapper from "./components/wrapper"

const Page = async (props: { params: Promise<{ locale: string; user_id: string }> }) => {
  const params = await props.params;

  const {
    user_id
  } = params;

  return (
    <>
      <Card className="w-full max-w-sm border-none bg-[#0A090959] backdrop-blur-md">
        <Card.Content className="p-4 md:p-6 lg:p-8 rtl:text-right">
          <Suspense>
            <Wrapper />
          </Suspense>
        </Card.Content>
      </Card>
    </>
  )
}

export default Page
