import Loader from "@/components/common/loader"
import { UploadFile } from "@/services/utils/upload-file"
import { cn } from "@/utils/cn"
import {
  ActionIcon,
  FileButton,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core"
import { useMutation } from "@tanstack/react-query"
import { CircleCheckBig, CircleX } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { useFormContext } from "./question-form"

const Answer = ({ answer }: { answer: "a" | "b" | "c" }) => {
  const form = useFormContext()
  const [lang] = useQueryState("lang", parseAsString.withDefault("ar"))
  const resetRef = useRef<() => void>(null)

  // handling video certificate
  const uploadMutation = useMutation({
    mutationFn: async ({ file, path }: { file: File; path: string }) => {
      console.log("🚀 ~ mutationFn: ~ path:", path)
      // uploading file
      const response = await UploadFile({
        file: file,
        path: `/video/wrong_answers_audio`,
      })
      return response.absolutePath
    },
    onSuccess(data, { path }) {
      form.setFieldValue(path, data)
    },
  })

  const { t } = useTranslation()

  const isCorrectAnswer = form.getValues().correct_answer === `answer_${answer}`

  return (
    <Paper p={"md"}>
      <Stack>
        <Group>
          <Text size="lg">
            {t(`questions.add.form.option-label`)} - {answer.toUpperCase()}{" "}
          </Text>

          <UnstyledButton
            onClick={() => {
              form.setFieldValue("correct_answer", `answer_${answer}`)
            }}>
            <Group>
              <CircleCheckBig
                className={cn(isCorrectAnswer ? "!text-secondary" : "!text-[#8A8A8A]")}
                size={22}
              />
              <Text className={cn(isCorrectAnswer ? "!text-secondary" : "!text-[#8A8A8A]")}>
                {t("questions.add.form.answer_right")}
              </Text>
            </Group>
          </UnstyledButton>
        </Group>
        <TextInput
          placeholder={t(`questions.add.form.option-placeholder`)}
          key={form.key(`answers_${answer}.${lang}`)}
          {...form.getInputProps(`answers_${answer}.${lang}`)}
        />
        {isCorrectAnswer ? null : (
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label={t("questions.add.form.decleration")}
              placeholder={t(`questions.add.form.text-explanation-placeholder`)}
              key={form.key(`wrong_${answer}.${lang}`)}
              {...form.getInputProps(`wrong_${answer}.${lang}`)}
            />
            <FileButton
              resetRef={resetRef}
              onChange={(file) => {
                console.log("🚀 ~ Answer ~ file:", file)
                if (!file) return
                uploadMutation.mutate({ file, path: `wrong_answer_audio_urls.${lang}.answer_${answer}` })
                resetRef.current?.()
              }}
              accept="audio/wav,audio/mpeg">
              {(props) => (
                <TextInput
                  leftSection={uploadMutation.isPending ? <Loader size={"xs"} /> : null}
                  readOnly
                  type="url"
                  label={t(`questions.add.form.wrong_audio_url`)}
                  placeholder={t("questions.add.form.wrong_audio_url_placeholder")}
                  key={form.key(`wrong_answer_audio_urls.${lang}.answer_${answer}`)}
                  {...form.getInputProps(`wrong_answer_audio_urls.${lang}.answer_${answer}`)}
                  rightSection={
                    <ActionIcon
                      onClick={() => {
                        form.setFieldValue(`wrong_answer_audio_urls.${lang}.answer_${answer}`, "")
                      }}
                      variant="transparent"
                      color="red">
                      <CircleX color="red" />
                    </ActionIcon>
                  }
                  {...props}
                />
              )}
            </FileButton>
          </SimpleGrid>
        )}
      </Stack>
    </Paper>
  )
}

export default Answer
