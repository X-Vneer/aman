import { Switch } from "@mantine/core"
import React, { useState } from "react"

import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { ToggleStoryVisibility } from "../toggle-visibility"
import { Story } from "../types"

const ToggleActivity = (story: Story) => {
  const { t } = useTranslation()
  const [state, setState] = useState(story.is_active)
  const queryClient = useQueryClient()
  const filter = {
    queryKey: ["stories"],
  }

  const { mutate } = useMutation({
    mutationFn: ToggleStoryVisibility,
    onMutate(variables) {
      queryClient.invalidateQueries(filter)
    },
    onSuccess() {
      queryClient.invalidateQueries(filter)
    },
    onError(error) {
      queryClient.invalidateQueries(filter)
      setState((pre) => !pre)
      notifications.show({
        radius: "xs",
        color: "white",
        title: t(`programs.toggle-error`),
        message:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response?.data?.message
            : error.message,
        classNames: {
          title: "!text-white",
          description: "!text-white",
          root: "!bg-red-500",
        },
      })
    },
  })

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const isCheck = e.currentTarget.checked

    setState(isCheck)
    mutate({
      id: story.id,
      isHidden: isCheck,
    })
  }
  return (
    <div>
      <Switch checked={state} onChange={handleChange} />
    </div>
  )
}

export default ToggleActivity
