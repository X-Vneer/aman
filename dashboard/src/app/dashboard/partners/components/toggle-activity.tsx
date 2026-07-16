import { Switch } from "@mantine/core"
import React, { useState } from "react"

import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { TogglePartnerActivity } from "../toggle-activity"
import { Partner } from "../types"

const ToggleActivity = (partner: Partner) => {
  const { t } = useTranslation()
  const [state, setState] = useState(partner.isActive)
  const queryClient = useQueryClient()
  const filter = {
    queryKey: ["partners"],
  }

  const { mutate } = useMutation({
    mutationFn: TogglePartnerActivity,
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
      id: partner.id + "",
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
