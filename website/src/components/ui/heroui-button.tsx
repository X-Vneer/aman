"use client"

import { cn, Button as HeroUIButton, type ButtonProps } from "@heroui/react"
import { Ripple } from "m3-ripple"
import type { ButtonRenderProps } from "react-aria-components"
import * as React from "react"

type ButtonChildrenArg = ButtonRenderProps & { defaultChildren: React.ReactNode }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function ButtonWithRipple(
  { children, className, ...props },
  ref,
) {
  const withRipple =
    typeof children === "function" ? (
      (values: ButtonChildrenArg) => (
        <>
          <Ripple />
          {children(values)}
        </>
      )
    ) : (
      <>
        <Ripple />
        {children}
      </>
    )

  return (
    <HeroUIButton ref={ref} className={cn("relative rounded-xl! font-bold", className)} {...props}>
      {withRipple}
    </HeroUIButton>
  )
})

export { Button }
export type { ButtonProps }
