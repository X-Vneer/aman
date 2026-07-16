import { Group, NumberInput, Stack, Text } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
type Props<T> = {
  label: string
  form: UseFormReturnType<T, unknown>
  formKey: string
}
const CustomTimeInput = <T,>(props: Props<T>) => {
  const form = props.form

  return (
    <Stack gap={"6"}>
      <Text>{props.label}</Text>

      <Group
        wrap="nowrap"
        gap={"xs"}
        className="h-10.5 items-center rounded-lg! border border-[#E2E2E2] bg-white! p-1!">
        <NumberInput
          min={0}
          max={10}
          hideControls
          radius={"sm"}
          className="aspect-square! h-full!"
          classNames={{
            input: "px-1 text-center! border-secondary!   bg-[#E8FAFA]! text-secondary!",
          }}
          px={"0"}
          key={form.key(`${props.formKey}.h`)}
          {...form.getInputProps(`${props.formKey}.h`)}
        />
        <span className="text-sm text-[#3F4142]">hh</span>
        <NumberInput
          min={0}
          max={60}
          hideControls
          radius={"sm"}
          className="aspect-square! h-full!"
          classNames={{
            input: "px-1! text-center! border-secondary!   bg-[#E8FAFA]! text-secondary!",
          }}
          px={"0"}
          key={form.key(`${props.formKey}.m`)}
          {...form.getInputProps(`${props.formKey}.m`)}
        />
        <span className="text-sm text-[#3F4142]">mm</span>
        <NumberInput
          min={0}
          max={60}
          hideControls
          radius={"sm"}
          className="aspect-square! h-full!"
          classNames={{
            input: "px-1! text-center! border-secondary!   bg-[#E8FAFA]! text-secondary!",
          }}
          px={"0"}
          key={form.key(`${props.formKey}.s`)}
          {...form.getInputProps(`${props.formKey}.s`)}
        />
        <span className="text-sm text-[#3F4142]">ss</span>
      </Group>
    </Stack>
  )
}

export default CustomTimeInput
