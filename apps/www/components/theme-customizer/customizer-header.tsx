import { ResetIcon } from "@radix-ui/react-icons";
import { Config, useConfig } from "@/hooks/use-config";
import { defaultTheme, themes } from "@/registry/themes";
import { Button } from "@/registry/new-york/ui/button";

type CssVars = Config["cssVars"]

const CustomizerHeader: React.FC = () => {
  const [, setConfig] = useConfig();

  const resetConfig = () => {
    setConfig({
      style: "default",
      theme: defaultTheme.name,
      cssVars: defaultTheme.cssVars,
    })
  }

  return (
    <div className="flex items-start">
      <div className="space-y-1 pr-2">
        <div className="font-semibold leading-none tracking-tight">
          Customize
        </div>
        <div className="text-xs text-muted-foreground">
          Pick a style and color for your components.
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto rounded-[0.5rem]"
        onClick={resetConfig}
      >
        <ResetIcon />
        <span className="sr-only">Reset</span>
      </Button>
    </div>
  );
};

export default CustomizerHeader;
