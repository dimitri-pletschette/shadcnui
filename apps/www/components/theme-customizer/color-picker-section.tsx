import React, { useEffect, useState } from "react"
import { PipetteIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { hexToHSL, hslToHex } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { Config, useConfig } from "@/hooks/use-config"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"

type CssVars = Config["cssVars"]

const ColorPickerSection: React.FC = () => {
  const [config, setConfig] = useConfig()
  const { resolvedTheme: mode } = useTheme()
  const [colorInfo, setColorInfo] = useState<{
    value: string
    key: keyof CssVars["light" | "dark"]
  } | null>(null)
  const debouncedColorInfo = useDebounce(colorInfo, 300)

  function groupColorsByMode(config: any, mode: string | undefined) {
    if (!mode || typeof config.cssVars[mode] !== "object") {
      return {}
    }

    return Object.keys(config.cssVars[mode]).reduce<{
      [key: string]: string[]
    }>((acc, key) => {
      const baseKey = key.endsWith("-foreground") ? key.slice(0, -11) : key
      acc[baseKey] = acc[baseKey] || []
      acc[baseKey].push(key)
      return acc
    }, {})
  }

  const handleColorChange =
    (key: keyof CssVars["light" | "dark"]) =>
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget?.value) {
        setColorInfo({ value: e.currentTarget.value, key })
      }
    }

  useEffect(() => {
    if (debouncedColorInfo) {
      const { value, key } = debouncedColorInfo
      const hsl = hexToHSL(value)
      const formattedHsl = `${hsl.h.toFixed(1)} ${hsl.s.toFixed(
        1
      )}% ${hsl.l.toFixed(1)}%`

      if (mode) {
        const assertedMode = mode === "light" ? "light" : "dark"
        setConfig({
          ...config,
          cssVars: {
            ...config.cssVars,
            [assertedMode]: {
              ...config.cssVars[assertedMode],
              [key]: formattedHsl,
            },
          },
        })
      }
    }
  }, [debouncedColorInfo])

  const getStyle = (
    key: keyof CssVars["light" | "dark"],
    mode: string | undefined
  ): React.CSSProperties => {
    if (!mode) return {}
    const assertedMode = mode === "light" ? "light" : "dark"
    const hslColor = config.cssVars[assertedMode][key]

    return {
      "--theme-primary": `hsl(${hslColor})`,
    } as React.CSSProperties
  }

  const getValue = (
    key: keyof CssVars["light" | "dark"],
    mode: string | undefined
  ) => {
    if (!mode) return ""
    const assertedMode = mode === "light" ? "light" : "dark"
    const hslColor = config.cssVars[assertedMode][key]
    return hslToHex(hslColor)
  }

  const groupedColors = groupColorsByMode(config, mode)

  const organizeColors = () => {
    const singles: { [key: string]: string[] } = {}
    const pairs: { [key: string]: string[] } = {}

    Object.entries(groupedColors).forEach(([baseKey, keys]) => {
      if (baseKey === "radius") return
      if (keys.length === 1) {
        singles[baseKey] = keys
      } else {
        pairs[baseKey] = keys
      }
    })

    return { singles, pairs }
  }

  const { singles, pairs } = organizeColors()

  const renderColors = (colors: { [key: string]: string[] }) => {
    return Object.entries(colors).map(([baseKey, keys]) => (
      <div
        key={baseKey}
        className="flex flex-col space-y-2 rounded-md border p-2"
      >
        <Label className="text-sm font-medium">{baseKey}</Label>
        <div className="flex flex-row space-x-2">
          {keys.map((key) => {
            const assertedKey = key as keyof CssVars["light" | "dark"]
            const hasPair = keys.length > 1
            const ref = React.createRef<HTMLInputElement>()
            return (
              <div
                key={key}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-y-1.5",
                  hasPair && "gap-y-0"
                )}
              >
                <div
                  className={cn(
                    "relative w-full text-transparent transition-colors duration-200 hover:text-foreground dark:hover:text-foreground/70",
                    {
                      "hover:text-card dark:hover:text-card/70":
                        key === "card-foreground",
                      "hover:text-card-foreground dark:hover:text-card-foreground/70":
                        key === "card",
                      "hover:text-popover dark:hover:text-popover/70":
                        key === "popover-foreground",
                      "hover:text-popover-foreground dark:hover:text-popover-foreground/70":
                        key === "popover",
                      "hover:text-primary dark:hover:text-primary/70":
                        key === "primary-foreground",
                      "hover:text-primary-foreground dark:hover:text-primary-foreground/70":
                        key === "primary",
                      "hover:text-secondary dark:hover:text-secondary/70":
                        key === "secondary-foreground",
                      "hover:text-secondary-foreground dark:hover:text-secondary-foreground/70":
                        key === "secondary",
                      "hover:text-muted dark:hover:text-muted/70":
                        key === "muted-foreground",
                      "hover:text-muted-foreground dark:hover:text-muted-foreground/70":
                        key === "muted",
                      "hover:text-accent dark:hover:text-accent/70":
                        key === "accent-foreground",
                      "hover:text-accent-foreground dark:hover:text-accent-foreground/70":
                        key === "accent",
                      "hover:text-destructive dark:hover:text-destructive/70":
                        key === "destructive-foreground",
                      "hover:text-destructive-foreground dark:hover:text-destructive-foreground/70":
                        key === "destructive",
                      "hover:text-background dark:hover:text-background/70":
                        key === "foreground",
                    }
                  )}
                >
                  <Input
                    type="color"
                    key={key}
                    className={cn(
                      "w-full rounded-full p-1",
                      `[&::-webkit-color-swatch]:p-0 `,
                      `[&::-webkit-color-swatch]:rounded-full`,
                      `[&::-webkit-color-swatch]:border-2`,
                      `[&::-webkit-color-swatch]:border-black/20`,
                      `dark:[&::-webkit-color-swatch]:border-white/20`,
                      `border-none [&::-webkit-color-swatch-wrapper]:p-0`,
                      "cursor-pointer"
                    )}
                    style={getStyle(assertedKey, mode)}
                    value={getValue(assertedKey, mode)}
                    onChange={handleColorChange(assertedKey)}
                    name={key}
                    ref={ref}
                  />
                  <PipetteIcon
                    size={18}
                    className="absolute left-[calc(50%-0.5rem)] top-[calc(50%-0.5rem)] cursor-pointer"
                    onClick={() => {
                      if (ref.current) {
                        ref.current.click()
                      }
                    }}
                  />
                </div>
                {hasPair && (
                  <label htmlFor={key} className="text-xs uppercase">
                    {key.endsWith("-foreground") ? "fg" : "bg"}
                  </label>
                )}
              </div>
            )
          })}
        </div>
      </div>
    ))
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">CSS Variables</Label>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {renderColors(pairs)}
        {renderColors(singles)}
      </div>
    </div>
  )
}

export default ColorPickerSection
