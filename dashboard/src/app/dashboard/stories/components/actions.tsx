import { ActionIcon } from "@mantine/core"
import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Story } from "../types"
import EditStoryModal from "./edit-story-modal"

const Actions = (story: Story) => {
  const { t } = useTranslation()
  const [action, setAction] = useState("")

  const handleEdit = () => {
    setAction("edit")
  }

  const closeModal = () => {
    setAction("")
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <ActionIcon
          radius="sm"
          color="secondary"
          variant="subtle"
          onClick={handleEdit}
          title={t("story.edit")}>
          <Edit strokeWidth={1.4} />
        </ActionIcon>
        {/* <ActionIcon radius="sm" color="red" variant="subtle" title={t("story.delete")}>
          <Trash2 strokeWidth={1.4} />
        </ActionIcon> */}
      </div>

      <EditStoryModal opened={action === "edit"} onClose={closeModal} story={story} />
    </>
  )
}

export default Actions
