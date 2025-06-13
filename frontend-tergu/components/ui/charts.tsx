import * as React from "react"
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

import { 
  Chart, 
  ChartContainer, 
  ChartTooltip, 
  ChartLegend, 
  ChartLegendItem 
} from "@/components/ui/chart"

interface LineChartProps {
  data: any[]
  categories: string[]
  colors?: string[]
  className?: string
  showLegend?: boolean
  showGrid?: boolean
  xAxisKey?: string
  height?: number
}

export function LineChart({
  data,
  categories,
  colors = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4"],
  className,
  showLegend = true,
  showGrid = true,
  xAxisKey = "name",
  height = 300,
}: LineChartProps) {
  return (
    <ChartContainer className={className}>
      <Chart>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <ChartTooltip wrapperStyle={{ outline: "none" }} />
            {categories.map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
        {showLegend && (
          <ChartLegend>
            {categories.map((category, index) => (
              <ChartLegendItem
                key={category}
                name={category}
                color={colors[index % colors.length]}
              />
            ))}
          </ChartLegend>
        )}
      </Chart>
    </ChartContainer>
  )
}

interface BarChartProps {
  data: any[]
  categories: string[]
  colors?: string[]
  className?: string
  showLegend?: boolean
  showGrid?: boolean
  index?: string
  height?: number
  layout?: "horizontal" | "vertical"
  stacked?: boolean
}

export function BarChart({
  data,
  categories,
  colors = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4"],
  className,
  showLegend = true,
  showGrid = true,
  index = "name",
  height = 300,
  layout = "vertical",
  stacked = false,
}: BarChartProps) {
  return (
    <ChartContainer className={className}>
      <Chart>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            layout={layout === "horizontal" ? "horizontal" : "vertical"}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <XAxis
              dataKey={layout === "horizontal" ? index : undefined}
              type={layout === "horizontal" ? "category" : "number"}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              dataKey={layout === "vertical" ? index : undefined}
              type={layout === "vertical" ? "category" : "number"}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <ChartTooltip wrapperStyle={{ outline: "none" }} />
            {categories.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                stackId={stacked ? "stack" : undefined}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
        {showLegend && (
          <ChartLegend>
            {categories.map((category, index) => (
              <ChartLegendItem
                key={category}
                name={category}
                color={colors[index % colors.length]}
              />
            ))}
          </ChartLegend>
        )}
      </Chart>
    </ChartContainer>
  )
}

interface PieChartProps {
  data: {
    name: string
    value: number
    color?: string
  }[]
  className?: string
  showLegend?: boolean
  height?: number
  innerRadius?: number
  outerRadius?: number
}

export function PieChart({
  data,
  className,
  showLegend = true,
  height = 300,
  innerRadius = 0,
  outerRadius = 100,
}: PieChartProps) {
  return (
    <ChartContainer className={className}>
      <Chart>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={1}
              dataKey="value"
              label={({ name, percent }) => 
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || `hsl(${index * 40}, 70%, 60%)`} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value}`, ""]}
              labelFormatter={(name) => ""}
              wrapperStyle={{ outline: "none" }}
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                padding: "0.5rem"
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
        {showLegend && (
          <ChartLegend>
            {data.map((entry, index) => (
              <ChartLegendItem
                key={entry.name}
                name={`${entry.name}: ${entry.value}`}
                color={entry.color || `hsl(${index * 40}, 70%, 60%)`}
              />
            ))}
          </ChartLegend>
        )}
      </Chart>
    </ChartContainer>
  )
} 