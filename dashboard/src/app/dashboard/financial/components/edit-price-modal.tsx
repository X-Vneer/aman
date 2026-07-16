import { Button, Modal, Stack, SimpleGrid, Title, Text, NumberInput, Group, Grid } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useTranslation } from "react-i18next"
import { VideosRevenue } from "../types"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PutUpdatePrice } from "../update-price"
import { notifications } from "@mantine/notifications"
import React from "react"
import axios from "axios"
import { RiyalIcon } from "@/components/icons"
type Props = {
  initial?: VideosRevenue[]
}
const EditPriceModal = ({ initial }: Props) => {
  const { t } = useTranslation()
  const [opened, { open, close }] = useDisclosure(false)

  const [prices, setPrices] = useState(() => {
    const initialValuesAsObj: Record<string, string | number> = {}
    initial?.map((e) => {
      initialValuesAsObj[e.video_id + ""] = e.price + ""
    })
    return initialValuesAsObj
  })

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: PutUpdatePrice,
    onSuccess() {
      close()
      queryClient.invalidateQueries({
        queryKey: ["financial", "generalStatistics"],
      })
    },
    onError(error) {
      notifications.show({
        radius: "xs",
        color: "white",
        title: axios.isAxiosError(error) ? error.response?.data.message || "" : error.message,
        message: error.message,
        classNames: {
          title: "!text-white",
          description: "!text-white",
          root: "!bg-red-500",
        },
      })
    },
  })

  const handleChange = (name: number, value: string) => {
    setPrices((pre) => ({ ...pre, [name]: value }))
  }

  // handle submit
  const onSubmit: React.FormEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    mutate({
      prices: Object.keys(prices).map((key) => {
        return {
          video_id: Number(key),
          price: Number(prices[key]),
        }
      }),
    })
  }

  return (
    <>
      <Modal opened={opened} centered size={"xl"} onClose={close} title={t("financial.update.title")}>
        {/* Modal content */}
        <Stack component={"form"} onSubmit={onSubmit}>
          {initial?.map((video) => {
            return (
              <Grid columns={3} key={video.video_id}>
                <Grid.Col span={{ base: 3, sm: 1 }}>
                  <Title pt="xs" order={4}>
                    {video.title}
                  </Title>
                </Grid.Col>
                <Grid.Col span={{ base: 3, sm: 2 }}>
                  <Grid columns={4} className="!flex-nowrap max-sm:!flex-wrap">
                    <Grid.Col span={1}>
                      <Stack gap={0}>
                        <Text size="sm" c={"gray"}>
                          {t("financial.update.current-price-label")}
                        </Text>
                        <Text size="lg" fw={600}>
                          {video.price} <RiyalIcon />
                        </Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Stack gap={0}>
                        <Group justify="space-between" wrap="nowrap">
                          <Text>{t(`financial.update.new-price-label`)}</Text>
                          <Text>
                            {t(`programs.add.form.price-description`, {
                              tax: "15%",
                              final:
                                (Number(prices[video.video_id]) +
                                  (Number(prices[video.video_id]) * 15) / 100 || 0).toFixed(2),
                            })}
                          </Text>
                        </Group>
                        <NumberInput
                          min={0}
                          value={prices[video.video_id]}
                          onChange={(value) => {
                            handleChange(video.video_id, value + "")
                          }}
                          name={video.video_id + ""}
                          // label={t("financial.update.new-price-label")}
                          variant="filled"
                        />
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </Grid>
            )
          })}
          <Group justify="end">
            <Button type="submit" loading={isPending}>
              {t("financial.update.save-button")}
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button disabled={!initial} onClick={open}>
        {t("financial.edit-button")}
      </Button>
    </>
  )
}

export default EditPriceModal
