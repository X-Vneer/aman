import { Loader as LoaderCom, LoaderProps } from "@mantine/core"

type Props = LoaderProps

const Loader = (props: Props) => {
  return (
    <div className="flex w-full items-center justify-center py-10 md:py-20">
      <LoaderCom size={"md"} {...props} />
    </div>
  )
}

export default Loader
