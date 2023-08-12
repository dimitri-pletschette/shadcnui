import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { Style } from "@/registry/styles"
import { DefaultTheme, Theme, defaultTheme } from "@/registry/themes"

export type Config = {
  style: Style["name"]
  theme: Theme["name"]
  cssVars: DefaultTheme["cssVars"]
}

const configAtom = atomWithStorage<Config>("config", {
  style: "default",
  theme: defaultTheme.name,
  cssVars: defaultTheme.cssVars,
})

export function useConfig() {
  return useAtom(configAtom)
}
