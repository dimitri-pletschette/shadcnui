import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Button } from "@/registry/new-york/ui/button"
import { Label } from "@/registry/new-york/ui/label"

const RadiusSection: React.FC = () => {
  const [config, setConfig] = useConfig()

  const updateBorderRadius = (radius: number | string) => {
    const floatRadius = parseFloat(radius.toString())
    setConfig({
      ...config,
      cssVars: {
        ...config.cssVars,
        light: {
          ...config.cssVars.light,
          radius: floatRadius as any,
        },
      },
    })
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Radius</Label>
      <div className="grid grid-cols-5 gap-2">
        {["0", "0.3", "0.5", "0.75", "1.0"].map((value) => {
          return (
            <Button
              variant={"outline"}
              size="sm"
              key={value}
              onClick={() => updateBorderRadius(value)}
              className={cn(
                "bg-primary/30",
                parseFloat(config.cssVars.light?.radius) ===
                  parseFloat(value) && "flex items-center justify-center gap-2",
                "rounded-r-none rounded-bl-none border-2 border-b-0 border-r-0 border-primary/70",
                {
                  grayscale:
                    parseFloat(config.cssVars.light?.radius) !==
                    parseFloat(value),
                }
              )}
              style={{
                borderTopLeftRadius: `${value}rem`,
              }}
            >
              <span>{value}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default RadiusSection
