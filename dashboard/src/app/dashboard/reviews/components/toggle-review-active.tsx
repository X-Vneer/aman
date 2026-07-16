import { Switch } from "@mantine/core"
import React, { useEffect, useState } from "react"

import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import { PostToggleReviewActive } from "../toggle-activity"
import { Datum, ReviewsResponse } from "../types"

type Props = {
  review: Datum
}

const readIsActive = (review: Datum) => review.is_active === "1"

const ToggleReviewActive = ({ review }: Props) => {
  const { t } = useTranslation()
  const [state, setState] = useState(() => readIsActive(review))
  const searchParams = useOptimisticSearchParams()
  const queryClient = useQueryClient()
  const filter = {
    queryKey: ["reviews", searchParams.toString()] as const,
  }

  const { mutate, isPending } = useMutation({
    mutationFn: PostToggleReviewActive,
    onMutate(variables) {
      queryClient.cancelQueries({ queryKey: filter.queryKey })
      queryClient.setQueryData<ReviewsResponse["data"]>(filter.queryKey, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          items: {
            ...oldData.items,
            data: oldData.items.data.map((row) =>
              row.id === review.id ? { ...row, is_active: variables.status === "true" ? "1" : "0" } : row,
            ),
          },
        }
      })
    },
    onSuccess() {
      notifications.show({
        title: t("reviews.toggle-success-title"),
        message: t("reviews.toggle-success-message"),
        color: "green",
      })
      queryClient.invalidateQueries(filter)
    },
    onError(error) {
      queryClient.invalidateQueries(filter)
      setState((pre) => !pre)
      notifications.show({
        radius: "xs",
        color: "white",
        title: t("reviews.toggle-error"),
        message:
          axios.isAxiosError(error) && error.response?.data?.message
            ? String(error.response.data.message)
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
    const contactId = review.id
    setState(isCheck)
    mutate({
      contactId,
      status: isCheck ? "true" : "false",
    })
  }

  return (
    <div className="flex justify-center">
      <Switch size="lg" checked={state} onChange={handleChange} disabled={isPending} />
    </div>
  )
}

export default ToggleReviewActive
