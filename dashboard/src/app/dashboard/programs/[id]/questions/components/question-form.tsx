/* eslint-disable react-refresh/only-export-components */
import CustomTimeInput from "@/components/common/custom-time-input"
import { WEBSITE_LANGS } from "@/config"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useNavigate } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { handleMantineFormError } from "@/utils/handle-mantineform-error"
import { formatTime } from "@/utils/time-formaters"
import { Button, Group, SimpleGrid, Stack, Text, TextInput } from "@mantine/core"
import { createFormContext } from "@mantine/form"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { Question } from "../@types"
import Answer from "./answer"
import { useQueryClient } from "@tanstack/react-query"

type TimeObject = {
  h: number
  m: number
  s: number
}

type LangsTimeObject = {
  ar: TimeObject
  en: TimeObject
}

export type QuestionFormValues = Omit<Question, "appears_at" | "allowed_time"> & {
  allowed_time: TimeObject
  appears_at: LangsTimeObject
}

export const [FormProvider, useFormContext, useForm] = createFormContext<QuestionFormValues, Question>()

const _initialValues = {
  question: {
    ar: "",
    en: "",
  },
  answers_a: {
    ar: "",
    en: "",
  },
  wrong_a: {
    ar: "",
    en: "",
  },
  answers_b: {
    ar: "",
    en: "",
  },
  wrong_b: {
    ar: "",
    en: "",
  },
  answers_c: {
    ar: "",
    en: "",
  },
  wrong_c: {
    ar: "",
    en: "",
  },

  correct_answer: "answer_a",
  allowed_time: {
    h: 0,
    m: 0,
    s: 30,
  },
  appears_at: {
    ar: { h: 0, m: 0, s: 0 },
    en: { h: 0, m: 0, s: 0 },
  },
  wrong_answer_audio_urls: {
    ar: {
      answer_a: "",
      answer_b: "",
      answer_c: "",
    },
    en: {
      answer_a: "",
      answer_b: "",
      answer_c: "",
    },
  },
}

const QuestionForm = ({ initialValues }: { initialValues?: QuestionFormValues }) => {
  const { id, questionId } = useParams() as { id: string; questionId?: string }
  const [lang, setLang] = useQueryState("lang", parseAsString.withDefault("ar"))
  const [completedLangs, setCompletedLangs] = useQueryState(
    "completed-langs",
    parseAsArrayOf(parseAsString).withDefault([]),
  )
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const initials = initialValues || _initialValues

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initials,
    transformValues(values) {
      const { appears_at, allowed_time, ...data } = values
      return {
        ...data,
        appears_at: {
          ar: formatTime(appears_at.ar),
          en: formatTime(appears_at.en),
        },
        allowed_time: formatTime(allowed_time),
      }
    },
    onValuesChange(values) {
      const localeKeys = ["question", "answers_a", "answers_b", "answers_c"] as const

      const completedLocales: string[] = WEBSITE_LANGS.filter((locale) =>
        localeKeys.every((key) => {
          const value = values[key][locale]
          return value.trim() !== ""
        }),
      )

      setCompletedLangs(completedLocales)
    },
  })

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const onSubmit = form.onSubmit(async (values) => {
    // A question set to 0:00:00 never triggers during playback (its slot is at the very
    // start, which the player's poster and fire-guard swallow). appears_at is per-language
    // and each tab is edited independently, so block a zero in EITHER language and reveal it.
    const ZERO = "00:00:00"
    const zeroLang = values.appears_at.ar === ZERO ? "ar" : values.appears_at.en === ZERO ? "en" : null
    if (zeroLang) {
      form.setFieldError("root", t("questions.add.form.appears_at_zero"))
      if (zeroLang !== lang) setLang(zeroLang)
      return
    }
    try {
      const data = {
        ...values,
        video_id: id,
      }
      const response = await (questionId
        ? AmanApi.put(`/questions/${questionId}`, data)
        : AmanApi.post("/questions", data))
      queryClient.invalidateQueries({ queryKey: ["programs"] })
      if (questionId) queryClient.invalidateQueries({ queryKey: ["questions", questionId] })
      navigate(`/dashboard/programs/${id}`)
    } catch (error) {
      handleMantineFormError(error, form)
    }
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={onSubmit}>
        <Stack>
          <Group justify="space-between">
            <Text className="!text-2xl ltr:!font-customEnglish ltr:!font-normal ltr:!italic">
              {t("questions.add.program-details")}
            </Text>
            <Stack>
              <Button
                loading={form.submitting}
                disabled={completedLangs?.length !== WEBSITE_LANGS.length}
                type="submit"
                className="!px-10">
                {t("global.save")}
              </Button>
              {form.errors.root ? <Text c="red">{form.errors.root}</Text> : null}
            </Stack>
          </Group>
          <Stack>
            <TextInput
              w={"100%"}
              label={t(`questions.add.form.question-label`)}
              placeholder={t("questions.add.form.question-placeholder")}
              key={form.key(`question.${lang}`)}
              {...form.getInputProps(`question.${lang}`)}
            />
            <Answer answer="a" />
            <Answer answer="b" />
            <Answer answer="c" />

            <Stack gap={"xs"}>
              <Text size="lg">{t(`questions.add.form.timing`)}</Text>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <CustomTimeInput
                  formKey={`appears_at.${lang}`}
                  form={form}
                  label={t(`programs.add.form.appears_at`)}
                />
                <CustomTimeInput
                  formKey="allowed_time"
                  form={form}
                  label={t(`programs.add.form.allowed_time`)}
                />
              </SimpleGrid>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default QuestionForm
