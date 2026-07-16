"use client"

import React from "react"
import { Button as HeroButton, Spinner, type ButtonProps as HeroButtonProps } from "@heroui/react"
import { Ripple } from "m3-ripple"
import type { ButtonRenderProps } from "react-aria-components"

import { cn } from "@/lib/cn"

type ButtonChildrenArg = ButtonRenderProps & { defaultChildren: React.ReactNode }

export type ButtonProps = HeroButtonProps & {
  onClick?: () => void
  isLoading?: boolean
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  as?: React.ElementType
  href?: string
  color?: string
  radius?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Comp(
  {
    className,
    onClick,
    onPress,
    isLoading,
    isPending,
    startContent,
    endContent,
    as: As,
    href,
    color: _color,
    radius: _radius,
    children,
    ...props
  },
  ref,
) {
  const pending = Boolean(isPending) || Boolean(isLoading)

  const content =
    typeof children === "function" ? (
      (values: ButtonChildrenArg) => (
        <>
          <Ripple />
          {startContent}
          {children(values)}
          {endContent}
        </>
      )
    ) : (
      <>
        <Ripple />
        {pending ? <Spinner className="shrink-0" color="current" size="sm" /> : startContent}
        {children}
        {endContent}
      </>
    )

  const mergedOnPress = (e: Parameters<NonNullable<HeroButtonProps["onClick"]>>[0]) => {
    onClick?.(e)
  }

  if (href) {
    const El = (As ?? "a") as React.ElementType
    return (
      <HeroButton
        {...props}
        ref={ref}
        className={cn("relative rounded-xl! font-bold", className)}
        fullWidth={props.fullWidth ?? true}
        isPending={pending}
        size={props.size ?? "lg"}
        variant={props.variant ?? "primary"}
        onPress={onPress}
        onClick={mergedOnPress}
        render={(buttonProps) => <El {...buttonProps} href={href} />}>
        {content}
      </HeroButton>
    )
  }

  return (
    <HeroButton
      {...props}
      ref={ref}
      className={cn("relative rounded-xl! font-bold", className)}
      fullWidth={props.fullWidth ?? true}
      isPending={pending}
      size={props.size ?? "lg"}
      variant={props.variant ?? "primary"}
      onClick={mergedOnPress}>
      {content}
    </HeroButton>
  )
})

export default Button
