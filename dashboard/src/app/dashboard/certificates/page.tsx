import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Image, Stack, Text, Title } from "@mantine/core"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import UploadModal from "./components/upload-modal"
import { GetCertificate } from "./get-certificates"

const Certificates = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const { data, error, isFetching } = useSuspenseQuery({
    queryKey: ["certificate"],
    queryFn: () => GetCertificate(),
  })
  if (error && !isFetching) {
    throw error
  }

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
        <UploadModal />
      </Group>

      <Group justify="center" mt="md">
        <Image src={data.item} alt={t("certificates.title")} maw={800} />
      </Group>
    </Stack>
  )
}

export default Certificates
