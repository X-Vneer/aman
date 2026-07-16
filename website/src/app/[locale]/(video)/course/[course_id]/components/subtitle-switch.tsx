import { Switch } from "@heroui/react"
import { SubtitlesIcon } from "lucide-react"

type Props = {
  isSelected: boolean
  onValueChange: (value: boolean) => void
  "aria-label"?: string
}

const SubTitleSwitch = ({ isSelected, onValueChange, "aria-label": ariaLabel }: Props) => {
  return (
    <div className="shrink-0">
      <Switch
        isSelected={isSelected}
        onChange={onValueChange}
        aria-label={ariaLabel ?? "Subtitles"}
        size="lg"
        className="flex items-center">
        {({ isSelected: on }) => (
          <Switch.Control className="h-8 w-8 min-h-0 min-w-0 border-0 bg-transparent p-0 shadow-none data-[selected=true]:bg-transparent">
            <Switch.Thumb className="flex h-8 w-8 items-center justify-center rounded-sm bg-transparent shadow-none data-[selected=true]:bg-transparent">
              <SubtitlesIcon
                className={on ? "size-7 shrink-0 text-primary" : "size-7 shrink-0 text-foreground"}
                strokeWidth={1.2}
              />
            </Switch.Thumb>
          </Switch.Control>
        )}
      </Switch>
    </div>
  )
}

export default SubTitleSwitch
