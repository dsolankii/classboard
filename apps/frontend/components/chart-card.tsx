"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Area, CartesianGrid } from "recharts"
import { useReducedMotion } from "framer-motion"

type Point = { date: string; count: number }

export function ChartCard({
  title,
  data,
  loading,
  height = 64,
  revision = 0, // new: bump to force re-animation
}: {
  title: string
  data: Point[]
  loading?: boolean
  height?: number
  revision?: number
}) {
  const reduce = useReducedMotion()
  const anim = !reduce

  const prepared = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { x: 0, y: 0, date: "" },
        { x: 1, y: 0, date: "" },
      ]
    }
    if (data.length === 1) {
      const only = data[0]
      return [
        { x: 0, y: only.count, date: only.date },
        { x: 1, y: only.count, date: only.date },
      ]
    }
    return data.map((d, i) => ({ x: i, y: d.count, date: d.date }))
  }, [data])

  const [yMin, yMax] = React.useMemo(() => {
    const ys = prepared.map((p) => p.y)
    const min = Math.min(...ys)
    const max = Math.max(...ys)
    if (min === max) {
      const lo = Math.max(0, min - 1)
      const hi = min + 1
      return [lo, hi]
    }
    const pad = Math.max(1, Math.round((max - min) * 0.15))
    const lo = Math.max(0, min - pad)
    const hi = max + pad
    return [lo, hi]
  }, [prepared])

  // Force a remount of the chart when data or revision changes to re-trigger Line/Area animations.
  const key = React.useMemo(() => {
    const tail = prepared[prepared.length - 1]
    return `line-${revision}-${prepared.length}-${tail?.y ?? 0}`
  }, [prepared, revision])

  if (loading) {
    return (
      <Card className="rounded-sm border bg-card">
        <CardHeader className="py-2">
          <CardTitle className="text-[13px]">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[64px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-sm border bg-card">
      <CardHeader className="py-2">
        <CardTitle className="text-[13px]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-1 pt-0">
        <ChartContainer
          config={{
            signups: { label: "Signups", color: "hsl(142 70% 45%)" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={prepared} key={key} margin={{ top: 2, right: 8, bottom: 4, left: 0 }}>
              <defs>
                <linearGradient id="area-signups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-signups)" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="var(--color-signups)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.12} />

              <XAxis
                dataKey="x"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                height={12}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(_, i) => {
                  const d = prepared[i]?.date ?? ""
                  return d ? d.replace(/-/g, "/") : ""
                }}
              />
              <YAxis
                domain={[yMin, yMax]}
                width={26}
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                allowDecimals={false}
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              <Area
                type="monotone"
                dataKey="y"
                stroke="transparent"
                fill="url(#area-signups)"
                isAnimationActive={anim}
                animationDuration={420}
                animationBegin={40}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="var(--color-signups)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
                isAnimationActive={anim}
                animationDuration={460}
                animationBegin={60}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
