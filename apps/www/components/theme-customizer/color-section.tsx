import React from "react"
import { CheckIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Config, useConfig } from "@/hooks/use-config"
import { Button } from "@/registry/new-york/ui/button"
import { Label } from "@/registry/new-york/ui/label"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { Theme, themes } from "@/registry/themes"

const ColorSection: React.FC = () => {
  const [config, setConfig] = useConfig()
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme: mode } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const updateTheme = (theme: Theme) => {
    setConfig({
      ...config,
      theme: theme.name,
      cssVars: theme.cssVars as any,
    })
  }

  const getUpdatedStyle = (theme: Theme) =>
    ({
      "--theme-primary": `hsl(${
        theme?.activeColor[mode === "dark" ? "dark" : "light"]
      })`,
    } as React.CSSProperties)

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Color</Label>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => {
          const isActive = config.theme === theme.name

          return mounted ? (
            <Button
              variant={"outline"}
              size="sm"
              key={theme.name}
              onClick={() => updateTheme(theme)}
              className={cn(
                "justify-start",
                isActive && "border-2 border-primary"
              )}
              style={getUpdatedStyle(theme)}
            >
              <span
                className={cn(
                  "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                )}
              >
                {isActive && <CheckIcon className="h-4 w-4 text-white" />}
              </span>
              {theme.label}
            </Button>
          ) : (
            <Skeleton className="h-8 w-full" key={theme.name} />
          )
        })}
      </div>
    </div>
  )
}

export default ColorSection
