import { Link } from "@/lib/i18n/navigation"
import { ActionIcon, Card, Group, ScrollArea, Stack, Text } from "@mantine/core"
import { CirclePlus, Clock, HelpCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import DeleteQuestionModal from "./delete-question"
import { Question } from "../../@types"

const Questions = ({ questions }: { questions: Question[] }) => {
  const { t } = useTranslation()
  const { id, locale } = useParams()

  return (
    <Stack gap={"xs"}>
      <Group justify="space-between">
        <Text className="!text-2xl">{t("programs.questions.title")}</Text>
        <Group gap="xs">
          <HelpCircle size={16} />
          <Text c="dimmed">
            {questions.length} {t("general.question")}
          </Text>
        </Group>
      </Group>

      <ScrollArea>
        <Group py={"md"}>
          <ActionIcon
            component={Link}
            to={`/dashboard/programs/${id}/questions/add`}
            className="!border-2 !border-dashed"
            w={250}
            h={138}
            variant="outline"
            color="secondary">
            <Stack align="center" gap={"xs"} component={"span"}>
              <CirclePlus size={24} strokeWidth={1.25} />
              <span>{t("programs.questions.add")}</span>
            </Stack>
          </ActionIcon>
          {questions.map((question, index) => (
            <Card shadow="sm" padding="md" radius="12" w={250}>
              <Stack>
                <Group justify="space-between" mb="xs">
                  <Text>
                    {index + 1}. {t("general.question")}
                  </Text>
                  <Group gap={"4"}>
                    <DeleteQuestionModal {...question} />
                    <ActionIcon
                      color="secondary"
                      variant="subtle"
                      radius={"sm"}
                      component={Link}
                      to={`/dashboard/programs/${id}/questions/${question.id}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none">
                        <path
                          d="M21.375 10.5938V12C21.375 16.4194 21.375 18.6292 20.002 20.002C18.6292 21.375 16.4194 21.375 12 21.375C7.58058 21.375 5.37087 21.375 3.99794 20.002C2.625 18.6292 2.625 16.4194 2.625 12C2.625 7.58058 2.625 5.37087 3.99794 3.99794C5.37087 2.625 7.58058 2.625 12 2.625H13.4062"
                          stroke="#18BDBE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M16.3613 3.98912L16.9696 3.38085C17.9774 2.37305 19.6114 2.37305 20.6192 3.38085C21.6269 4.38866 21.6269 6.02264 20.6192 7.03045L20.0108 7.63871M16.3613 3.98912C16.3613 3.98912 16.4373 5.28168 17.5778 6.42218C18.7183 7.56267 20.0108 7.63871 20.0108 7.63871M16.3613 3.98912L10.7693 9.58119C10.3905 9.95995 10.2011 10.1493 10.0382 10.3582C9.84609 10.6044 9.68137 10.871 9.54698 11.153C9.43304 11.392 9.34835 11.6461 9.17896 12.1543L8.63665 13.7813M20.0108 7.63871L14.4188 13.2308C14.0401 13.6095 13.8507 13.7989 13.6418 13.9618C13.3956 14.1539 13.129 14.3186 12.847 14.4531C12.608 14.567 12.3539 14.6516 11.8457 14.821L10.2188 15.3634M8.63665 13.7813L8.28573 14.834C8.20238 15.0841 8.26746 15.3597 8.45385 15.5462C8.64025 15.7326 8.91595 15.7976 9.16602 15.7143L10.2188 15.3634M8.63665 13.7813L10.2188 15.3634"
                          stroke="#18BDBE"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </ActionIcon>
                  </Group>
                </Group>

                <Text lineClamp={2}>{question.question[locale as "ar" | "en"]}</Text>
                <Group gap="xs">
                  <Clock size={14} />
                  <Text size="sm" c="dimmed">
                    {question.appears_at[locale as "ar" | "en"]}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </Group>
      </ScrollArea>
    </Stack>
  )
}

export default Questions
