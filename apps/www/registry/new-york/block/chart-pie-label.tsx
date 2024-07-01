"use client"

import { TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  LabelList,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    colors: {
      light: "#3b82f6",
      dark: "#f43f5e",
    },
  },
  safari: {
    label: "Safari",
    colors: {
      light: "#60a5fa",
      dark: "#fb7185",
    },
  },
  firefox: {
    label: "Firefox",
    colors: {
      light: "#93c5fd",
      dark: "#fda4af",
    },
  },
  edge: {
    label: "Edge",
    colors: {
      light: "#bfdbfe",
      dark: "#fecdd3",
    },
  },
  other: {
    label: "Other",
    colors: {
      light: "#dbeafe",
      dark: "#ffe4e6",
    },
  },
} satisfies ChartConfig

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pie Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
