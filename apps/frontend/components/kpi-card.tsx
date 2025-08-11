"use client"

import React from "react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, useReducedMotion, useSpring } from "framer-motion"
import { ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

type TrendPoint = { x: string | number; y: number }

export function KpiCard({
  title,
  value,
  delta,
  loading,
  trend,
}: {
  title: string
  value: number
  delta: number
  loading?: boolean
  trend?: TrendPoint[]
}) {
  const shouldReduce = useReducedMotion()
  const spring = useSpring(value, { stiffness: 120, damping: 18 })
  const [display, setDisplay] = React.useState(value)

  React.useEffect(() => {
    if (shouldReduce) {
      setDisplay(value)
      return
    }
    spring.set(value)
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)))
    return () => unsub()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, shouldReduce])

  if (loading) {
    return (
      <Card className="rounded-md shadow-sm">
        <CardHeader className="py-2">
          <Skeleton className="h-3 w-20" />
        </CardHeader>
        <CardContent className="py-2">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="mt-2 h-3 w-12" />
        </CardContent>
      </Card>
    )
  }

  const positive = delta >= 0
  const anim = !shouldReduce

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <Card className="rounded-md border bg-card shadow-sm transition-colors">
        <CardHeader className="py-2">
          <CardTitle className="text-[11px] font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between gap-2 pb-2 pt-0">
          <div className="space-y-1">
            <div className="text-lg font-semibold tabular-nums md:text-xl">{display.toLocaleString()}</div>
            <div
              className={`flex items-center text-[11px] ${
                positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {positive ? (
                <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="mr-1 h-3.5 w-3.5" />
              )}
              <span className="tabular-nums">{Math.abs(delta)}%</span>
            </div>
          </div>

          {/* Tiny minimal sparkline */}
          {trend && trend.length > 1 ? (
            <div className="h-10 w-24">
              <ChartContainer
                config={{
                  t: { label: "Trend", color: "hsl(var(--chart-1))" },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trend.map((d) => ({ x: d.x, y: d.y }))}
                    margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient id="kpi-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="y"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#kpi-grad)"
                      strokeWidth={1.5}
                      isAnimationActive={anim}
                      animationDuration={500}
                      animationBegin={80}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
