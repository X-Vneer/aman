import { Group } from "@mantine/core"
import LangFilter from "./lang-filter"
import ProgramFilter from "./program-filter"
import DateFilter from "./date-filter"

const Filters = () => {
  return (
    <Group>
      <LangFilter />
      <ProgramFilter />
      <DateFilter />
    </Group>
  )
}

export default Filters
