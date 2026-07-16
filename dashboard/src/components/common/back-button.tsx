import { ActionIcon } from "@mantine/core"
import { ArrowRight, ChevronRight, CircleArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const BackButton = () => {
  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
  }
  return (
    <ActionIcon onClick={goBack} radius={"xl"} size={"lg"} variant="subtle" color={"dark"}>
      <CircleArrowRight className="size-8 ltr:rotate-180" strokeWidth={1.6} />
    </ActionIcon>
  )
}

export default BackButton
