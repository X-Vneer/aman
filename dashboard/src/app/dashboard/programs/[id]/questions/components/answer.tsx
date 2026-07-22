import { cn } from "@/utils/cn"
import { Group, Paper, Stack, Text, TextInput, UnstyledButton } from "@mantine/core"
import { CircleCheckBig } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useTranslation } from "react-i18next"
import { useFormContext } from "./question-form"

const Answer = ({ answer }: { answer: "a" | "b" | "c" }) => {
  const form = useFormContext()
  const [lang] = useQueryState("lang", parseAsString.withDefault("ar"))

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
          <TextInput
            label={t("questions.add.form.decleration")}
            placeholder={t(`questions.add.form.text-explanation-placeholder`)}
            key={form.key(`wrong_${answer}.${lang}`)}
            {...form.getInputProps(`wrong_${answer}.${lang}`)}
          />
        )}
      </Stack>
    </Paper>
  )
}

export default Answer
