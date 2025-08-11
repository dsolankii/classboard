"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DateRangePicker, type DateRange } from "@/components/date-range-picker"
import { RoleSelect } from "@/components/role-select"
import { SearchInput } from "@/components/search-input"

export function FilterDrawer({
  value,
  onChange,
}: {
  value: { role: any; q: string; date: DateRange }
  onChange: (v: { role: any; q: string; date: DateRange }) => void
}) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const fn = () => setOpen((o) => !o)
    const onToggle = () => fn()
    const handler = () => onToggle()
    window.addEventListener("classboard:toggle-filters", handler as any)
    return () => window.removeEventListener("classboard:toggle-filters", handler as any)
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">Filters</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <label className="text-sm font-medium">Date range</label>
          <DateRangePicker value={value.date} onChange={(r) => onChange({ ...value, date: r })} />
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <RoleSelect value={value.role} onChange={(r) => onChange({ ...value, role: r })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Keyword</label>
            <SearchInput value={value.q} onChange={(q) => onChange({ ...value, q })} />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
