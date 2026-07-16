import Loader from "@/components/common/loader"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Link, useParams } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { getNotifications } from "@/services/utils/get-notifications"
import {
  ActionIcon,
  Avatar,
  Badge,
  CloseButton,
  Group,
  Indicator,
  Popover,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import "dayjs/locale/ar"
import relativeTime from "dayjs/plugin/relativeTime"
import { Bell } from "lucide-react"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Error from "./error"
import InfiniteScrollContainer from "./infinte-scroll-container"
dayjs.extend(relativeTime)

const UserNotifications = () => {
  const { locale } = useParams()
  dayjs.locale(locale)
  const sm = useSmallScreen()
  const { t } = useTranslation()
  const [opened, { open, close, toggle }] = useDisclosure()

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, error } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: ({ pageParam }) => getNotifications({ page: pageParam }),
      initialPageParam: "1",
      getNextPageParam: (lastPage) => {
        return lastPage.meta.last_page == lastPage.meta.current_page
          ? null
          : Number(lastPage.meta.current_page) + 1 + ""
      },
      staleTime: Infinity,
    })

  // const queryClient = useQueryClient()

  const notifications = data?.pages.flatMap((page) => page.data) || []

  // has new notifications
  const { data: hasNewNotification } = useQuery({
    queryKey: ["has-new-notifications"],
    queryFn: async () => {
      const response = await AmanApi.get<{
        data: {
          is_new_notification: boolean
        }
      }>(`/is-new-notifications`)
      return response.data.data.is_new_notification
    },
    // check for new notification every 10 sec
    refetchInterval: 1000 * 10,
  })

  // invalidate notifications query if has new notification
  const queryClient = useQueryClient()
  useEffect(() => {
    if (hasNewNotification) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }
  }, [hasNewNotification])
  return (
    <>
      <Popover
        opened={opened}
        onChange={toggle}
        shadow="lg"
        width={sm ? "70%" : 490}
        position="bottom"
        withArrow>
        <Popover.Target>
          <Indicator disabled={!hasNewNotification} color="red">
            <ActionIcon onClick={open} variant="white">
              <Bell size={20} />
            </ActionIcon>
          </Indicator>
        </Popover.Target>
        <Popover.Dropdown className="!border-none" p="0">
          <Group p="md" justify="space-between">
            <Group gap={"xs"}>
              <Title order={4}>{t("notifications.title")}</Title>
              {/* <Badge dir="ltr" size="lg" circle color="primary" variant="light">
                <span>100</span>
              </Badge> */}
            </Group>
            <CloseButton onClick={close} />
          </Group>

          <ScrollArea h={400} w={"100%"}>
            {status === "pending" ? <Loader size={"sm"} /> : null}
            {status === "error" ? <Error error={error} /> : null}
            <InfiniteScrollContainer
              className="divide-y"
              onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
              {notifications.map((notification, index) => (
                <div key={notification.id + index}>
                  <Link
                    to={`/dashboard/${notification.title_id.toLocaleLowerCase() == "payment" ? "users" : "contacts"}`}>
                    <Group className="p-3 duration-200 hover:bg-gray-100" align="start">
                      <Avatar />
                      <Stack gap={"xs"} className="grow">
                        <Text>
                          {notification.title_id.toLocaleLowerCase() === "payment"
                            ? notification.notificationable?.video_title
                            : notification.notificationable?.name}
                        </Text>
                        <Text c={"gary.5"} size="sm">
                          {dayjs(new Date(notification.created_at)).format("DD/MM/YYYY")}
                        </Text>
                        <Badge size="sm" variant="outline" color="gray">
                          {notification.title_id}
                        </Badge>
                      </Stack>
                      <Stack className="self-end" justify="end">
                        <Text c={"gray"} size="xs">
                          {dayjs(new Date(notification.created_at)).fromNow()}
                        </Text>
                      </Stack>
                    </Group>
                  </Link>
                </div>
              ))}
              {isFetchingNextPage && <Loader size="sm" />}
            </InfiniteScrollContainer>
          </ScrollArea>
        </Popover.Dropdown>
      </Popover>
    </>
  )
}

export default UserNotifications
