import { Italic } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleDemo() {
  return (
    <Toggle size="default" aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
