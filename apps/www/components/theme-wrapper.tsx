"use client"

import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"

interface ThemeWrapperProps extends React.ComponentProps<"div"> {
  defaultTheme?: string
}

export function ThemeWrapper({
  defaultTheme,
  children,
  className,
}: ThemeWrapperProps) {
  const [config] = useConfig()
  const { resolvedTheme: mode } = useTheme()
  const assertedMode = mode === "light" ? "light" : "dark"

  const prefixedCssVars = Object.keys(config.cssVars[assertedMode]).reduce(
    (acc, key) => {
      const assertedMode = mode === "light" ? "light" : "dark"
      let value
      if (assertedMode === "light") {
        const assertedKey = key as keyof typeof config.cssVars.light
        value = config.cssVars[assertedMode][assertedKey]
      } else {
        const assertKey = key as keyof typeof config.cssVars.dark
        value = config.cssVars[assertedMode][assertKey]
      }
      acc[`--${key}`] = value !== undefined ? `${value}` : ""
      return acc
    },
    {} as Record<string, string>
  )

  const style = {
    ...prefixedCssVars,
    "--radius": `${defaultTheme ? "0.5" : config.cssVars.light.radius}rem`,
  } as React.CSSProperties

  return (
    <div
      className={cn(
        `theme-${defaultTheme || config.theme}`,
        "w-full",
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}
