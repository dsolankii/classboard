"use client"

import { type Role } from "@/types"
import { roleOptions } from "@/lib/filters"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RoleSelect({
  value,
  onChange,
  includeAll = true,
}: {
  value: Role | "all"
  onChange: (v: Role | "all") => void
  includeAll?: boolean
}) {
  return (
    <Select value={value} onValueChange={(v: any) => onChange(v)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        {roleOptions
          .filter((r) => (includeAll ? true : r !== "all"))
          .map((r) => (
            <SelectItem key={r} value={r}>
              {r === "all" ? "All roles" : r[0].toUpperCase() + r.slice(1)}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
