import { handleMantineFormError } from "@/utils/handle-mantineform-error"
import { Button, Grid, Group, Modal, NumberInput, Select, Stack, TextInput, Textarea } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { useTranslation } from "react-i18next"
import { Story } from "../types"
import { UpdateStory, UpdateStoryData } from "../update-story"
import { useQueryClient } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { getVideos } from "@/services/utils/get-videos"

interface EditStoryModalProps {
  opened: boolean
  onClose: () => void
  story: Story
}

const EditStoryModal = ({ opened, onClose, story }: EditStoryModalProps) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  
  // Fetch videos for program selection
  const { data: videos = [] } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => await getVideos(),
  })

  const form = useForm<UpdateStoryData>({
    initialValues: {
      title: story?.title,
      content: story?.content,
      first_name: story?.first_name,
      last_name: story?.last_name,
      mobile: story?.mobile,
      email: story?.email,
      video_id: story?.video_id,
      age: story?.age,
    },
    validate: {
      title: (value) => (!value ? t("story.title-required") : null),
      content: (value) => (!value ? t("story.content-required") : null),
      first_name: (value) => (!value ? t("story.first-name-required") : null),
      last_name: (value) => (!value ? t("story.last-name-required") : null),
      mobile: (value) => (!value ? t("story.mobile-required") : null),
      email: (value) => (!value ? t("story.email-required") : null),
      video_id: (value) => null, // Optional field
      age: (value) => (!value ? t("story.age-required") : null),
    },
  })

  const handleSubmit = async (values: UpdateStoryData) => {
    if (!story) return

    try {
      await UpdateStory(story.id, values)
      queryClient.invalidateQueries({ queryKey: ["stories"] })
      notifications.show({
        title: "Success",
        message: t("story.story-updated"),
        color: "green",
      })
      onClose()
    } catch (error) {
      handleMantineFormError(error, form)
      notifications.show({
        title: "Error",
        message: t("story.story-not-updated"),
        color: "red",
      })
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t("story.edit-story")} centered size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Grid columns={3}>
            <Grid.Col span={{ base: 3, md: 1 }}>
              <TextInput
                label={t("story.first-name")}
                placeholder={t("story.enter-first-name")}
                {...form.getInputProps("first_name")}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 3, md: 1 }}>
              <TextInput
                label={t("story.last-name")}
                placeholder={t("story.enter-last-name")}
                {...form.getInputProps("last_name")}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 3, md: 1 }}>
              <NumberInput
                size="md"
                hideControls
                min={0}
                max={100}
                label={t("story.age")}
                placeholder={t("story.enter-age")}
                {...form.getInputProps("age")}
                required
              />
            </Grid.Col>
          </Grid>
          <TextInput
            label={t("story.title")}
            placeholder={t("story.enter-title")}
            {...form.getInputProps("title")}
            required
          />

          <Select
            label="Program"
            placeholder="Select a program (optional)"
            data={videos.map((video) => ({
              value: video.id,
              label: video.title,
            }))}
            {...form.getInputProps("video_id")}
            searchable
            clearable
          />

          <Grid columns={2}>
            <Grid.Col span={{ base: 2, md: 1 }}>
              <TextInput
                label={t("story.mobile")}
                placeholder={t("story.enter-mobile")}
                {...form.getInputProps("mobile")}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 2, md: 1 }}>
              <TextInput
                label={t("story.email")}
                placeholder={t("story.enter-email")}
                type="email"
                {...form.getInputProps("email")}
                required
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label={t("story.content")}
            placeholder={t("story.enter-content")}
            {...form.getInputProps("content")}
            required
            minRows={4}
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={onClose}>
              {t("story.cancel")}
            </Button>
            <Button type="submit" loading={form.submitting}>
              {t("story.update")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default EditStoryModal
