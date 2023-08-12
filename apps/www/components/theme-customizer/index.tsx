"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
} from "@radix-ui/react-icons"
import template from "lodash.template"
import { Paintbrush } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useConfig, Config } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { DrawerContent, DrawerTrigger } from "@/components/drawer"
import { ThemeWrapper } from "@/components/theme-wrapper"
import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { Theme, themes } from "@/registry/themes"

import "@/styles/mdx.css"
import { Drawer } from "vaul"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"
import CustomizerHeader from "./customizer-header"
import StyleSection from "./style-section"
import ColorSection from "./color-section"
import RadiusSection from "./radius-section"
import ModeSection from "./mode-section"
import ColorPickerSection from "./color-picker-section"

export function ThemeCustomizer() {
  const [config, setConfig] = useConfig()
  const { resolvedTheme: mode } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getUpdatedStyle = (theme: Theme) => ({
    "--theme-primary": `hsl(${theme?.activeColor[
      mode === "dark" ? "dark" : "light"
    ]
    })`,
  } as React.CSSProperties)

  const updateTheme = (theme: Theme) => {
    setConfig({
      ...config,
      theme: theme.name,
      cssVars: theme.cssVars as any,
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <Drawer.Root>
        <DrawerTrigger asChild>
          <Button variant="outline" className="md:hidden">
            <Paintbrush className="mr-2 h-4 w-4" />
            Customize
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85%] p-6 pt-10">
          <Customizer />
        </DrawerContent>
      </Drawer.Root>
      <div className="hidden md:flex">
        <div className="mr-2 hidden items-center space-x-0.5 lg:flex">
          {mounted ? (
            <>
              {["zinc", "rose", "blue", "green", "orange"].map((color) => {
                const theme = themes.find((theme) => theme.name === color)
                const isActive = config.theme === color

                if (!theme) {
                  return null
                }

                return (
                  <Tooltip key={theme.name}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => updateTheme(theme)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs",
                          isActive
                            ? "border-[--theme-primary]"
                            : "border-transparent"
                        )}
                        style={getUpdatedStyle(theme)}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]"
                          )}
                        >
                          {isActive && (
                            <CheckIcon className="h-4 w-4 text-white" />
                          )}
                        </span>
                        <span className="sr-only">{theme.label}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      className="rounded-[0.5rem] bg-zinc-900 text-zinc-50"
                    >
                      {theme.label}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </>
          ) : (
            <div className="mr-1 flex items-center space-x-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Paintbrush className="mr-2 h-4 w-4" />
              Customize
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="z-40 w-[340px] rounded-[0.5rem] bg-white p-6 dark:bg-zinc-950"
          >
            <Customizer />
          </PopoverContent>
        </Popover>
      </div>
      <CopyCodeButton />
    </div>
  )
}

export function Customizer({ className }: { className?: string }) {
  return (
    <ThemeWrapper
      defaultTheme="zinc"
      className={cn(
        "scroll-y-auto fixed inset-y-0 right-0 flex h-screen max-w-[30rem] flex-col space-y-4 overflow-y-scroll rounded-md border-2 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-black/80 md:space-y-6",
        className
      )}
    >
      <CustomizerHeader />
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <StyleSection />
        <ColorSection />
        <RadiusSection />
        <ModeSection />
        <ColorPickerSection />
      </div>
    </ThemeWrapper>
  );
}

function CopyCodeButton() {
  const [config] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  const copyCode = () => {
    if (!config) return;
    copyToClipboardWithMeta(getThemeCode(config, parseFloat(config.cssVars.light.radius || "0.5")), {
      name: "copy_theme_code",
      properties: {
        theme: config.theme,
        radius: config.cssVars.light.radius || "0.5",
      },
    })
    setHasCopied(true)
  }

  return (
    <>
      {config && (
        <Button
          onClick={copyCode}
          className="md:hidden"
        >
          {hasCopied ? (
            <CheckIcon className="mr-2 h-4 w-4" />
          ) : (
            <CopyIcon className="mr-2 h-4 w-4" />
          )}
          Copy
        </Button>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hidden md:flex">Copy code</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl outline-none">
          <DialogHeader>
            <DialogTitle>Theme</DialogTitle>
            <DialogDescription>
              Copy and paste the following code into your CSS file.
            </DialogDescription>
          </DialogHeader>
          <ThemeWrapper defaultTheme="zinc" className="relative">
            <CustomizerCode />
            {config && (
              <Button
                size="sm"
                onClick={copyCode}
                className="absolute right-4 top-4 bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
              >
                {hasCopied ? (
                  <CheckIcon className="mr-2 h-4 w-4" />
                ) : (
                  <CopyIcon className="mr-2 h-4 w-4" />
                )}
                Copy
              </Button>
            )}
          </ThemeWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CustomizerCode() {
  const [config] = useConfig()

  return (
    <ThemeWrapper defaultTheme="zinc" className="relative space-y-4">
      <div data-rehype-pretty-code-fragment="">
        <pre className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            <span className="line text-white">@layer base &#123;</span>
            <span className="line text-white">&nbsp;&nbsp;:root &#123;</span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
              {config?.cssVars.light["background"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
              {config?.cssVars.light["foreground"]};
            </span>
            {[
              "card",
              "popover",
              "primary",
              "secondary",
              "muted",
              "accent",
              "destructive",
            ].map((prefix) => (
              <>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                  {
                    config?.cssVars.light[
                    prefix as keyof typeof config.cssVars.light
                    ]
                  }
                  ;
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                  {
                    config?.cssVars.light[
                    `${prefix}-foreground` as keyof typeof config.cssVars.light
                    ]
                  }
                  ;
                </span>
              </>
            ))}
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
              {config?.cssVars.light["border"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
              {config?.cssVars.light["input"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
              {config?.cssVars.light["ring"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--radius: {config.cssVars.light.radius || "0.5"}rem;
            </span>
            <span className="line text-white">&nbsp;&nbsp;&#125;</span>
            <span className="line text-white">&nbsp;</span>
            <span className="line text-white">&nbsp;&nbsp;.dark &#123;</span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
              {config?.cssVars.dark["background"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
              {config?.cssVars.dark["foreground"]};
            </span>
            {[
              "card",
              "popover",
              "primary",
              "secondary",
              "muted",
              "accent",
              "destructive",
            ].map((prefix) => (
              <>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                  {
                    config?.cssVars.dark[
                    prefix as keyof typeof config.cssVars.dark
                    ]
                  }
                  ;
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                  {
                    config?.cssVars.dark[
                    `${prefix}-foreground` as keyof typeof config.cssVars.dark
                    ]
                  }
                  ;
                </span>
              </>
            ))}
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
              {config?.cssVars.dark["border"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
              {config?.cssVars.dark["input"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
              {config?.cssVars.dark["ring"]};
            </span>
            <span className="line text-white">&nbsp;&nbsp;&#125;</span>
            <span className="line text-white">&#125;</span>
          </code>
        </pre>
      </div>
    </ThemeWrapper>
  )
}

function getThemeCode(config: Config, radius: number) {
  if (!config) {
    return ""
  }

  return template(BASE_STYLES_WITH_VARIABLES)({
    colors: config.cssVars,
    radius,
  })
}

const BASE_STYLES_WITH_VARIABLES = `
@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: <%- radius %>rem;
  }
 
  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
  }
}
`