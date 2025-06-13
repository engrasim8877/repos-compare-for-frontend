import * as React from "react"
import { Tooltip as RechartsTooltip } from "recharts"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("rounded-md border", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("p-4", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

interface ChartTooltipContentProps {
  payload?: any[]
  label?: string
  active?: boolean
}

const ChartTooltipContent = ({ payload, label, active }: ChartTooltipContentProps) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="rounded-md border bg-background p-2 shadow-md text-sm">
      <p className="font-medium">{label}</p>
      <ul className="mt-1 space-y-1">
        {payload.map((item: any, index: number) => (
          <li key={index} className="flex items-center justify-between gap-2">
            <span className="flex items-center">
              <span 
                className="mr-1 inline-block h-2 w-2 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}:</span>
            </span>
            <span className="font-medium">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Component wrapper for recharts Tooltip
const ChartTooltip = (props: any) => {
  return <RechartsTooltip content={<ChartTooltipContent />} {...props} />
}

interface ChartLegendProps {
  children: React.ReactNode
}

const ChartLegend = ({ children }: ChartLegendProps) => {
  return <div className="mt-4 flex items-center justify-center flex-wrap gap-4">{children}</div>
}

interface ChartLegendItemProps {
  name: string
  color: string
}

const ChartLegendItem = ({ name, color }: ChartLegendItemProps) => {
  return (
    <div className="flex items-center">
      <span className="mr-2 block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm text-muted-foreground">{name}</span>
    </div>
  )
}

export { 
  Chart, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendItem 
}

