import { Group, Pagination } from "@mantine/core"
import { parseAsInteger, useQueryState } from "nuqs"

type Props = {
  last_page: number | undefined
}

const PaginationCom = ({ last_page }: Props) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  if (!last_page) return null
  return last_page > 1 ? (
    <Group justify="center" py={"lg"}>
      <Pagination radius={"sm"} color="gray" variant="" onChange={setPage} value={page} total={last_page} />
    </Group>
  ) : null
}

export default PaginationCom
