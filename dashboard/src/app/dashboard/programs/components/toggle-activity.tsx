import { Switch } from "@mantine/core"
import React, { useState } from "react"

import { Video } from "@/@types/videos"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { PostToggleActivity } from "../toggle-activity"

const ToggleActivity = (video: Video) => {
  const { t } = useTranslation()
  const [state, setState] = useState(video.deleted_at ? false : true)
  const queryClient = useQueryClient()
  const filter = {
    queryKey: ["programs"],
  }

  const { mutate } = useMutation({
    mutationFn: PostToggleActivity,
    onMutate(variables) {
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
      id: video.id,
      status: isCheck ? "true" : "false",
    })
  }
  return (
    <div>
      <Switch checked={state} onChange={handleChange} />
    </div>
  )
}

export default ToggleActivity
