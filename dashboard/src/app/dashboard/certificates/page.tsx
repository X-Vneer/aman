import { useSmallScreen } from "@/hooks/use-small-screen"
import { Button, Group, Image, SegmentedControl, Select, Space, Stack, Text, Title } from "@mantine/core"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import UploadModal from "./components/upload-modal"
import { GetCertificates } from "./get-certificates"
import { ChevronDown } from "lucide-react"

const Certificates = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const { data, error, isFetching } = useSuspenseQuery({
    queryKey: ["certificates"],
    queryFn: () => GetCertificates(),
  })
  if (error && !isFetching) {
    throw error
  }

  const formattedData = data.items.data.map((element) => ({
    value: element.id,
    label: element.title,
    certificate: element.certificate_url,
  }))
  const [tab, setTab] = useState(formattedData[0].value)

  return (
    <Stack>
      <Group justify="space-between" wrap="nowrap">
        <div>
          <Title
            className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
            size={sm ? "h3" : "h2"}
            order={2}>
            {t("certificates.title")}
          </Title>
          <Text size="sm" c={"gary"}>
            {t("certificates.description")}
          </Text>
        </div>
        <Group gap={sm ? "xs" : "md"} wrap="nowrap">
          {/* <Button size={sm ? "sm" : "md"} px={sm ? undefined : "xl"}>
            {t("certificates.save")}
          </Button> */}
          <UploadModal id={tab} />
        </Group>
      </Group>

      <Space />

      <Group justify="center">
        {/* <SegmentedControl size={sm ? "xs" : "lg"} value={tab} onChange={setTab} data={formattedData} /> */}
        <Select
          rightSection={<ChevronDown />}
          allowDeselect={false}
          value={tab}
          onChange={(value) => {
            if (value) setTab(value)
          }}
          data={formattedData}
        />
      </Group>

      {formattedData.map((element) => {
        if (element.value !== tab) return null
        return (
          <div key={element.value}>
            <Image src={element.certificate} />
          </div>
        )
      })}
    </Stack>
  )
}

export default Certificates
