"use client"

import React from "react"
import Image from "next/image"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { User } from "@/types"

export function UsersTable({
  data,
  page,
  total,
  limit,
  onPageChange,
  onSortToggle,
  sortDir,
  onRowAction,
  onBulkDisable,
  onRowClick,
  canAdmin = false,
}: {
  data: User[]
  page: number
  total: number
  limit: number
  onPageChange: (p: number) => void
  onSortToggle: () => void
  sortDir: "asc" | "desc"
  onRowAction: (action: "view" | "edit" | "disable" | "enable", user: User) => void
  onBulkDisable: (ids: string[]) => void
  onRowClick?: (user: User) => void
  canAdmin?: boolean
}) {
  const { toast } = useToast()
  const [selected, setSelected] = React.useState<string[]>([])

  const formatJoin = (iso: string) => (iso ? iso.slice(0, 10).replace(/-/g, "/") : "")

  const toggleAll = (checked: boolean) => setSelected(checked ? data.map((d) => d.id) : [])
  const toggleOne = (id: string, checked: boolean) =>
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)))

  const pages = Math.ceil(total / limit)

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      toast({ title: "Copied", description: "Email copied to clipboard" })
    } catch {
      toast({ title: "Copy failed", description: "Unable to copy email", variant: "destructive" })
    }
  }

  return (
    <div className="w-full text-sm">
      {canAdmin && selected.length > 0 ? (
        <div className="mb-2 flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => onBulkDisable(selected)}>
            Disable selected ({selected.length})
          </Button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border shadow-sm">
        {/* Desktop table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="h-10">
                {canAdmin && (
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selected.length > 0 && selected.length === data.length}
                      onCheckedChange={(v) => toggleAll(!!v)}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                )}
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="cursor-pointer select-none text-xs" onClick={onSortToggle}>
                  Joined {sortDir === "asc" ? "↑" : "↓"}
                </TableHead>
                {canAdmin && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((u) => (
                <TableRow key={u.id} className={cn("h-11 hover:bg-muted/40", u.disabled && "opacity-60")}>
                  {canAdmin && (
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(u.id)}
                        onCheckedChange={(v) => toggleOne(u.id, !!v)}
                        aria-label={`Select ${u.name}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Image
                        src={u.avatarUrl || "/placeholder.svg?height=28&width=28&query=avatar"}
                        alt={`${u.name} avatar`}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                      <button className="text-left hover:underline" onClick={() => onRowClick?.(u)}>
                        {u.name}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <button className="hover:underline" onClick={() => copyEmail(u.email)} title="Copy email">
                      {u.email}
                    </button>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px]",
                        u.disabled && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                        !u.disabled &&
                          u.role === "admin" &&
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                        !u.disabled &&
                          u.role === "teacher" &&
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                        !u.disabled &&
                          u.role === "student" &&
                          "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
                      )}
                    >
                      {u.disabled ? "Disabled" : u.role[0].toUpperCase() + u.role.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatJoin(u.createdAt)}</TableCell>
                  {canAdmin && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Row actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onRowAction("view", u)}>View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onRowAction("edit", u)}>Edit</DropdownMenuItem>
                          {!u.disabled ? (
                            <DropdownMenuItem onClick={() => onRowAction("disable", u)}>Disable</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => onRowAction("enable", u)}>Enable</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile stacked cards */}
        <div className="divide-y md:hidden">
          {data.map((u) => (
            <div key={u.id} className={cn("flex flex-col gap-2 p-3", u.disabled && "opacity-60")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={u.avatarUrl || "/placeholder.svg?height=28&width=28&query=avatar"}
                    alt={`${u.name} avatar`}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <div className="text-sm font-medium">{u.name}</div>
                </div>
                {canAdmin && (
                  <Checkbox checked={selected.includes(u.id)} onCheckedChange={(v) => toggleOne(u.id, !!v)} />
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                <button className="hover:underline" onClick={() => copyEmail(u.email)}>
                  {u.email}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5",
                    u.disabled && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                    !u.disabled &&
                      u.role === "admin" &&
                      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                    !u.disabled &&
                      u.role === "teacher" &&
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                    !u.disabled &&
                      u.role === "student" &&
                      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
                  )}
                >
                  {u.disabled ? "Disabled" : u.role[0].toUpperCase() + u.role.slice(1)}
                </span>
                <div>{formatJoin(u.createdAt)}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => onRowAction("view", u)}>
                  View
                </Button>
                {canAdmin && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => onRowAction("edit", u)}>
                      Edit
                    </Button>
                    {!u.disabled ? (
                      <Button size="sm" variant="ghost" onClick={() => onRowAction("disable", u)}>
                        Disable
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => onRowAction("enable", u)}>
                        Enable
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-xs">
          Page {page} of {pages || 1}
        </div>
        <Button
          variant="outline"
          size="icon"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
