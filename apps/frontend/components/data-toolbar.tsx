"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function DataToolbar({
  chips,
  onClear,
  onOpenFilters,
}: {
  chips: { label: string; onRemove?: () => void }[]
  onClear: () => void
  onOpenFilters: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {chips.length === 0 ? <span className="text-sm text-muted-foreground">No filters applied</span> : null}
        {chips.map((chip, i) => (
          <Badge key={i} variant="secondary" className="gap-1">
            {chip.label}
            {chip.onRemove ? (
              <button
                type="button"
                aria-label={`Remove ${chip.label}`}
                className="ml-1 rounded p-0.5 hover:bg-muted"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  chip.onRemove?.()
                }}
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onOpenFilters} aria-label="Open filters">
          Filters
        </Button>
        <Button variant="ghost" onClick={onClear} aria-label="Clear all filters">
          Clear all
        </Button>
      </div>
    </div>
  )
}
