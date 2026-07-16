"use client"
import Button from "@/components/ui/button"
import { AmanApiGuest } from "@/services/aman"
import { getVideos } from "@/services/utils/get-videos"
import { ErrorResponse } from "@/types"
import { storiesSchema } from "@/validation/stories-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  Checkbox,
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import ar from "react-phone-number-input/locale/ar.json"
import en from "react-phone-number-input/locale/en.json"
import PhoneInput from "react-phone-number-input/react-hook-form"
import "react-phone-number-input/style.css"
import { z } from "zod"

type Props = {}

const StoriesForm = (props: Props) => {
  const t = useTranslations("stories.form")
  const { locale } = useParams()

  const { control, ...form } = useForm({
    resolver: zodResolver(storiesSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      title: "",
      mobile: "",
      age: "",
      email: "",
      hasAttendedProgram: "",
      selectedVideo: "",
      programName: "",
      content: "",
      agreeToDisplay: false,
    },
  })

  // Fetch user videos
  const { data: userVideos, isLoading: isLoadingUserVideos } = useQuery({
    queryKey: ["videos"],
    queryFn: () => getVideos(),
    enabled: form.watch("hasAttendedProgram") === "yes",
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        video_id: data.selectedVideo,
        program_name: data.programName,
      }
      const response = await AmanApiGuest.post("/stories", payload)
      form.reset()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const responseError = error.response.data as ErrorResponse<z.infer<typeof storiesSchema>>
        form.setError("root", { message: responseError.message })
        if (responseError.errors) {
          for (let key in responseError.errors) {
            form.setError(key as keyof typeof responseError.errors, {
              message: responseError.errors![key as keyof typeof responseError.errors]![0],
            })
          }
        }
        return
      }
      form.setError("root", { message: t("errors.serverError") })
    }
  })

  return (
    <section className="flex items-center justify-center gap-4 px-4 py-12 md:py-16 lg:py-20">
      <Card className="w-full max-w-5xl shrink-0 rounded-xl bg-[#0A090959] p-1">
        <div className="mb-3 space-y-1 rounded-t-lg bg-[#1D1B1B] px-7 py-5 md:px-9 md:py-7 lg:px-12 lg:py-9">
          <h1 className="text-xl lg:text-2xl">{t("title")}</h1>
          <p className="text-sm text-default-500">{t("description")}</p>
        </div>
        <div className="px-6 py-5 md:px-10 md:py-6 lg:px-16 lg:py-7">
          <form onSubmit={onSubmit} className="block space-y-4 md:space-y-10">
            {/* First Row - First Name and Last Name */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-1/2">
                <Controller
                  control={control}
                  name="first_name"
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      isInvalid={!!form.formState.errors.first_name?.message}
                      className="w-full">
                      <Label className="text-xs text-default-500!">{t("firstName")}</Label>
                      <Input type="text" placeholder={t("firstNamePlaceholder")} {...field} />
                      {form.formState.errors.first_name?.message ? (
                        <FieldError>
                          {t(`errors.${form.formState.errors.first_name?.message as "required"}`)}
                        </FieldError>
                      ) : null}
                    </TextField>
                  )}
                />
              </div>
              <div className="md:w-1/2">
                <Controller
                  control={control}
                  name="last_name"
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      isInvalid={!!form.formState.errors.last_name?.message}
                      className="w-full">
                      <Label className="text-xs text-default-500!">{t("lastName")}</Label>
                      <Input type="text" placeholder={t("lastNamePlaceholder")} {...field} />
                      {form.formState.errors.last_name?.message ? (
                        <FieldError>
                          {t(`errors.${form.formState.errors.last_name?.message as "required"}`)}
                        </FieldError>
                      ) : null}
                    </TextField>
                  )}
                />
              </div>
            </div>

            {/* Second Row - Occupation and Age */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-1/2">
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      isInvalid={!!form.formState.errors.title?.message}
                      className="w-full">
                      <Label className="text-xs text-default-500!">{t("occupation")}</Label>
                      <Input type="text" placeholder={t("occupationPlaceholder")} {...field} />
                      {form.formState.errors.title?.message ? (
                        <FieldError>
                          {t(`errors.${form.formState.errors.title?.message as "required"}`)}
                        </FieldError>
                      ) : null}
                    </TextField>
                  )}
                />
              </div>
              <div className="md:w-1/2">
                <Controller
                  control={control}
                  name="age"
                  render={({ field }) => (
                    <TextField fullWidth isInvalid={!!form.formState.errors.age?.message} className="w-full">
                      <Label className="text-xs text-default-500!">{t("age")}</Label>
                      <Input
                        type="number"
                        max={100}
                        min={0}
                        placeholder={t("agePlaceholder")}
                        {...field}
                      />
                      {form.formState.errors.age?.message ? (
                        <FieldError>
                          {t(`errors.${form.formState.errors.age?.message as "required"}`)}
                        </FieldError>
                      ) : null}
                    </TextField>
                  )}
                />
              </div>
            </div>

            {/* Third Row - Phone Number and Email */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div dir="ltr" className="md:w-1/2">
                <TextField
                  fullWidth
                  isInvalid={!!form.formState.errors.mobile?.message}
                  className="w-full"
                  aria-labelledby="stories-form-mobile-label">
                  <p
                    id="stories-form-mobile-label"
                    className="mb-2 text-xs text-default-500! rtl:text-right">
                    {t("phoneNumber")}
                  </p>
                  <PhoneInput
                    control={control}
                    name="mobile"
                    labels={locale === "ar" ? ar : en}
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="PS"
                    inputComponent={Input}
                    placeholder="+970"
                  />
                  {form.formState.errors.mobile?.message ? (
                    <FieldError>
                      {t(`errors.${form.formState.errors.mobile?.message as "required"}`)}
                    </FieldError>
                  ) : null}
                </TextField>
              </div>
              <div className="md:w-1/2">
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      isInvalid={!!form.formState.errors.email?.message}
                      className="w-full">
                      <Label className="text-xs text-default-500!">{t("email")}</Label>
                      <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
                      {form.formState.errors.email?.message ? (
                        <FieldError>
                          {t(`errors.${form.formState.errors.email?.message as "required"}`)}
                        </FieldError>
                      ) : null}
                    </TextField>
                  )}
                />
              </div>
            </div>

            {/* Fourth Row - Has Attended Program */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-1/2">
                <Controller
                  control={control}
                  name="hasAttendedProgram"
                  render={({ field }) => (
                    <div className="flex w-full flex-col gap-1">
                      <Label className="text-xs text-default-500!" id="stories-has-program-label">
                        {t("hasAttendedProgram")}
                      </Label>
                      <Select
                        ref={field.ref}
                        name={field.name}
                        aria-labelledby="stories-has-program-label"
                        className="w-full"
                        fullWidth
                        placeholder={t("hasAttendedProgramPlaceholder")}
                        value={field.value || null}
                        onBlur={field.onBlur}
                        onChange={(key) => field.onChange(key != null ? String(key) : "")}
                        isInvalid={!!form.formState.errors.hasAttendedProgram?.message}>
                        <Select.Trigger className="w-full">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover className="min-w-[var(--trigger-width)]">
                          <ListBox
                            aria-label={t("hasAttendedProgram")}
                            className="max-h-60 w-full min-w-[var(--trigger-width)] outline-none">
                            <ListBox.Item key="yes" id="yes" textValue={t("yes")}>
                              <Label>{t("yes")}</Label>
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item key="no" id="no" textValue={t("no")}>
                              <Label>{t("no")}</Label>
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item key="other" id="other" textValue={t("other")}>
                              <Label>{t("other")}</Label>
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      {form.formState.errors.hasAttendedProgram?.message ? (
                        <FieldError>
                          {t(`errors.${form.formState.errors.hasAttendedProgram?.message as "required"}`)}
                        </FieldError>
                      ) : null}
                    </div>
                  )}
                />
              </div>
              <div className="md:w-1/2">
                {/* Video Selection - Only show if user has attended a program */}
                {form.watch("hasAttendedProgram") === "yes" && (
                  <div className="flex flex-col gap-4">
                    <Controller
                      control={control}
                      name="selectedVideo"
                      render={({ field }) => (
                        <div className="flex w-full flex-col gap-1">
                          <Label className="text-xs text-default-500!" id="stories-video-label">
                            {t("selectedVideo")}
                          </Label>
                          <Select
                            ref={field.ref}
                            name={field.name}
                            aria-labelledby="stories-video-label"
                            className="w-full"
                            fullWidth
                            placeholder={t("selectedVideoPlaceholder")}
                            value={field.value || null}
                            onBlur={field.onBlur}
                            onChange={(key) => field.onChange(key != null ? String(key) : "")}
                            isInvalid={!!form.formState.errors.selectedVideo?.message}
                            isDisabled={isLoadingUserVideos}>
                            <Select.Trigger className="w-full">
                              <Select.Value />
                              <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover className="min-w-[var(--trigger-width)]">
                              <ListBox
                                aria-label={t("selectedVideo")}
                                className="max-h-60 w-full min-w-[var(--trigger-width)] outline-none">
                                {userVideos?.videos
                                  ? userVideos.videos.map((video) => (
                                      <ListBox.Item
                                        key={video.id}
                                        id={video.id}
                                        textValue={video.title}>
                                        <Label>{video.title}</Label>
                                        <ListBox.ItemIndicator />
                                      </ListBox.Item>
                                    ))
                                  : null}
                              </ListBox>
                            </Select.Popover>
                          </Select>
                          {form.formState.errors.selectedVideo?.message ? (
                            <FieldError>
                              {t(`errors.${form.formState.errors.selectedVideo?.message as "required"}`)}
                            </FieldError>
                          ) : null}
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Program Name Input - Only show if user selected "other" */}
                {form.watch("hasAttendedProgram") === "other" && (
                  <div className="flex flex-col gap-4">
                    <Controller
                      control={control}
                      name="programName"
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          isInvalid={!!form.formState.errors.programName?.message}
                          className="w-full">
                          <Label className="text-xs text-default-500!">{t("programName")}</Label>
                          <Input type="text" placeholder={t("programNamePlaceholder")} {...field} />
                          {form.formState.errors.programName?.message ? (
                            <FieldError>
                              {t(`errors.${form.formState.errors.programName?.message as "required"}`)}
                            </FieldError>
                          ) : null}
                        </TextField>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Fifth Row - Story Textarea */}
            <div className="flex flex-col gap-4">
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    isInvalid={!!form.formState.errors.content?.message}
                    className="w-full">
                    <Label className="text-xs text-default-500!">{t("story")}</Label>
                    <TextArea rows={5} placeholder={t("storyPlaceholder")} {...field} />
                    <Description>{t("storyDescription")}</Description>
                    {form.formState.errors.content?.message ? (
                      <FieldError>
                        {t(`errors.${form.formState.errors.content?.message as "required"}`)}
                      </FieldError>
                    ) : null}
                  </TextField>
                )}
              />
            </div>

            {/* Sixth Row - Agreement Checkbox */}
            <div className="flex flex-col gap-4">
              <Controller
                control={control}
                name="agreeToDisplay"
                render={({ field }) => (
                  <Checkbox
                    ref={field.ref}
                    name={field.name}
                    isSelected={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    isInvalid={!!form.formState.errors.agreeToDisplay?.message}>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Content>
                      <span className="text-sm text-white">{t("agreeToDisplay")}</span>
                    </Checkbox.Content>
                  </Checkbox>
                )}
              />
              {form.formState.errors.agreeToDisplay?.message && (
                <p className="text-sm text-danger-500">
                  {t(`errors.${form.formState.errors.agreeToDisplay?.message as "required"}`)}
                </p>
              )}
            </div>

            {/* Submit Button and Messages */}
            <div className="flex flex-col items-center justify-center gap-4">
              <Button isLoading={form.formState.isSubmitting} type="submit" className="mx-auto max-w-sm">
                {t("submit")}
              </Button>
              {form.formState.errors.root ? (
                <p className="text-sm font-semibold text-danger-500">{form.formState.errors.root.message}</p>
              ) : (
                ""
              )}
              {form.formState.isSubmitSuccessful ? (
                <p className="text-sm font-semibold text-success-500">{t("success")}</p>
              ) : (
                ""
              )}
            </div>
          </form>
        </div>
      </Card>
    </section>
  )
}

export default StoriesForm
