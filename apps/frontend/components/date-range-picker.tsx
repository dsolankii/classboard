"use client"

import React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type DateRange = { from?: Date; to?: Date }

export function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange
  onChange: (r: DateRange) => void
}) {
  const [open, setOpen] = React.useState(false)
  const display =
    value.from && value.to ? `${format(value.from, "LLL d, y")} - ${format(value.to, "LLL d, y")}` : "Pick a date range"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("justify-start text-left font-normal", !value.from && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {display}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Preset label="Last 7" onClick={() => onChange({ from: addDays(new Date(), -7), to: new Date() })} />
            <Preset label="Last 30" onClick={() => onChange({ from: addDays(new Date(), -30), to: new Date() })} />
            <Preset label="This Month" onClick={() => {
              const d = new Date()
              onChange({ from: new Date(d.getFullYear(), d.getMonth(), 1), to: new Date() })
            }} />
            <Preset label="Custom" onClick={() => { /* Keep open, user picks below */ }} />
          </div>
          <Calendar
            mode="range"
            selected={{ from: value.from, to: value.to }}
            onSelect={(r: any) => onChange(r)}
            numberOfMonths={2}
            defaultMonth={value.from || new Date()}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

function Preset({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button size="sm" variant="secondary" onClick={onClick}>
      {label}
    </Button>
  )
}
