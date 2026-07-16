"use client"
import Button from "@/components/ui/button"
import { AmanApiGuest } from "@/services/aman"
import { getVideos } from "@/services/utils/get-videos"
import { UploadFile } from "@/services/utils/upload-file"
import { ErrorResponse } from "@/types"
import { contactSchema } from "@/validation/contact-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  Tabs,
  TextArea,
  TextField,
} from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { X } from "lucide-react"
import { Ripple } from "m3-ripple"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import ar from "react-phone-number-input/locale/ar.json"
import en from "react-phone-number-input/locale/en.json"
import PhoneInput from "react-phone-number-input/react-hook-form"
import "react-phone-number-input/style.css"
import { z } from "zod"

const TYPES = ["Inquiry", "Complaint", "Suggestion"] as const
const MAX_IMAGES = 5

const ContactForm = () => {
  const t = useTranslations("contact-us.form")
  const { locale } = useParams() as { locale: string }
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  const { data: videosData } = useQuery({
    queryKey: ["contact-videos"],
    queryFn: getVideos,
  })
  const videos = videosData?.videos ?? []

  const { control, ...form } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: "Inquiry",
      name: "",
      email: "",
      mobile: "",
      message: "",
      subject: "",
      images: [],
      video_title: undefined,
      video_id: undefined,
    },
  })

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageUrls])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ""

    if (imageFiles.length + files.length > MAX_IMAGES) {
      form.setError("images", { message: "maxLength" })
      return
    }

    const newFiles = [...imageFiles, ...files].slice(0, MAX_IMAGES)
    const addedFiles = newFiles.slice(imageFiles.length)
    const addedUrls = addedFiles.map((file) => URL.createObjectURL(file))

    setImageFiles(newFiles)
    setImageUrls((prev) => [...prev, ...addedUrls])
    form.clearErrors("images")
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index])
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const resetImages = () => {
    imageUrls.forEach((url) => URL.revokeObjectURL(url))
    setImageFiles([])
    setImageUrls([])
  }

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setUploadingImages(true)

      let uploadedImageUrls: string[] = []
      if (imageFiles.length > 0) {
        const uploadResults = await Promise.all(
          imageFiles.map((file, index) => UploadFile(file, `contacts/${Date.now()}-${index}`)),
        )
        uploadedImageUrls = uploadResults.map((result) => result.absolutePath)
      }

      const payload = {
        ...data,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
        video_id: data.video_id || undefined,
        video_title: data.video_id
          ? videos.find((v) => v.id === data.video_id)?.title
          : data.video_title,
      }

      await AmanApiGuest.post("/contacts", payload)

      form.reset()
      resetImages()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const responseError = error.response.data as ErrorResponse<z.infer<typeof contactSchema>>
        form.setError("root", { message: responseError.message })
        if (responseError.errors) {
          for (const key in responseError.errors) {
            form.setError(key as keyof typeof responseError.errors, {
              message: responseError.errors[key as keyof typeof responseError.errors]![0],
            })
          }
        }
        return
      }

      form.setError("root", { message: t("errors.serverError") })
    } finally {
      setUploadingImages(false)
    }
  })

  const imagesDisabled = imageFiles.length >= MAX_IMAGES || uploadingImages

  return (
    <form onSubmit={onSubmit} className="block space-y-5 md:space-y-10">
      <div className="flex flex-col gap-4">
        <label className="text-default-500 text-sm">{t("type-label")}</label>

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Tabs
              className="gap-1"
              selectedKey={field.value}
              variant="secondary"
              onSelectionChange={(key) => field.onChange(key as (typeof TYPES)[number])}>
              <Tabs.ListContainer>
                <Tabs.List aria-label="Tabs variants">
                  {TYPES.map((element) => (
                    <Tabs.Tab key={element} className="text-lg" id={element}>
                      <Ripple />
                      {t(`tabs.${element.toLocaleLowerCase()}`)}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
              {TYPES.map((element) => (
                <Tabs.Panel key={element} className="sr-only" id={element}>
                  {element}
                </Tabs.Panel>
              ))}
            </Tabs>
          )}
        />
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-1/2">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                fullWidth
                isInvalid={!!form.formState.errors.email?.message}
                className="w-full">
                <Label className="text-xs text-default-500!">
                  {t("email-input-label")} <span className="text-danger">*</span>
                </Label>
                <Input type="text" placeholder={t("email-input-placeholder")} {...field} />
                {form.formState.errors.email?.message ? (
                  <FieldError>
                    {t(`errors.${form.formState.errors.email?.message as "required"}`)}
                  </FieldError>
                ) : null}
              </TextField>
            )}
          />
        </div>
        <div className="md:w-1/2">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                fullWidth
                isInvalid={!!form.formState.errors.name?.message}
                className="w-full">
                <Label className="text-xs text-default-500!">
                  {t("name-input-label")} <span className="text-danger">*</span>
                </Label>
                <Input type="text" placeholder={t("name-input-placeholder")} {...field} />
                {form.formState.errors.name?.message ? (
                  <FieldError>
                    {t(`errors.${form.formState.errors.name?.message as "required"}`)}
                  </FieldError>
                ) : null}
              </TextField>
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div dir="ltr" className="md:w-1/2">
          <TextField
            fullWidth
            isInvalid={!!form.formState.errors.mobile?.message}
            className="w-full"
            aria-labelledby="contact-mobile-label">
            <p
              id="contact-mobile-label"
              className="text-default-500!  text-xs rtl:text-right">
              {t("mobile-input-label")} <span className="text-danger">*</span>
            </p>
            <div className="[&_.PhoneInputCountryIcon]:mr-2! [&_.PhoneInputCountryIcon]:ml-0! [&_.PhoneInputCountryIcon]:h-4! [&_.PhoneInputCountryIcon]:w-5! [&_.PhoneInputCountryIconImg]:h-4! [&_.PhoneInputCountryIconImg]:w-5!">
              <PhoneInput
                control={control}
                name="mobile"
                labels={locale === "ar" ? ar : en}
                international
                defaultCountry="SA"
                inputComponent={Input}
                placeholder="+966"
              />
            </div>
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
            name="subject"
            render={({ field }) => (
              <TextField
                fullWidth
                isInvalid={!!form.formState.errors.subject?.message}
                className="w-full">
                <Label className="text-xs text-default-500!">
                  {t("subject-input-label")} <span className="text-danger">*</span>
                </Label>
                <Input type="text" placeholder={t("subject-input-placeholder")} {...field} />
                {form.formState.errors.subject?.message ? (
                  <FieldError>
                    {t(`errors.${form.formState.errors.subject?.message as "required"}`)}
                  </FieldError>
                ) : null}
              </TextField>
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <TextField
              fullWidth
              isInvalid={!!form.formState.errors.message?.message}
              className="w-full">
              <Label className="text-xs text-default-500!">
                {t("message-input-label")} <span className="text-danger">*</span>
              </Label>
              <TextArea rows={5} placeholder={t("message-input-placeholder")} {...field} />
              {form.formState.errors.message?.message ? (
                <FieldError>
                  {t(`errors.${form.formState.errors.message?.message as "required"}`)}
                </FieldError>
              ) : null}
            </TextField>
          )}
        />
      </div>
      <div className="flex flex-col gap-4">
        <Controller
          control={control}
          name="video_id"
          render={({ field }) => (
            <div className="flex w-full flex-col gap-1">
              <Label className="text-xs text-default-500!" id="contact-video-label">
                {t("video_title_label")}
              </Label>
              <Select
                ref={field.ref}
                name={field.name}
                aria-labelledby="contact-video-label"
                className="w-full"
                fullWidth
                placeholder={t("video_title_placeholder")}
                value={field.value || null}
                onBlur={field.onBlur}
                onChange={(key) => field.onChange(key != null ? String(key) : undefined)}
                isInvalid={!!form.formState.errors.video_id?.message}>
                <Select.Trigger className="w-full">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="min-w-[var(--trigger-width)]">
                  <ListBox
                    aria-label={t("video_title_label")}
                    className="max-h-60 w-full min-w-[var(--trigger-width)] outline-none">
                    {videos.map((v) => (
                      <ListBox.Item key={v.id} id={v.id} textValue={v.title}>
                        <Label>{v.title}</Label>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          )}
        />
        <label className="text-default-500! text-xs">{t("images-input-label")}</label>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={imagesDisabled}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`border-default-300 hover:border-default-400 flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-4 transition-colors ${
            imagesDisabled ? "cursor-not-allowed opacity-50" : ""
          }`}>
          <span className="text-default-500 text-sm">
            {imageFiles.length >= MAX_IMAGES
              ? t("images-max-reached")
              : uploadingImages
                ? t("uploading")
                : t("images-upload-placeholder")}
          </span>
        </label>
        {form.formState.errors.images?.message && (
          <p className="text-danger-500 text-sm">
            {t(`errors.${form.formState.errors.images?.message as "maxLength"}`)}
          </p>
        )}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {imageUrls.map((url, index) => (
              <div key={url} className="relative">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className="h-32 w-full rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                  className="bg-danger hover:bg-danger-600 absolute top-1 right-1 rounded-full p-1 text-white">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          isLoading={form.formState.isSubmitting || uploadingImages}
          type="submit"
          className="mx-auto max-w-sm">
          {t("submit-button")}
        </Button>
        {form.formState.errors.root ? (
          <p className="text-danger-500 text-sm font-semibold">{form.formState.errors.root.message}</p>
        ) : null}
        {form.formState.isSubmitSuccessful ? (
          <p className="text-success-500 text-sm font-semibold">{t("success")}</p>
        ) : null}
      </div>
    </form>
  )
}

export default ContactForm
