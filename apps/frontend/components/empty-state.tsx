"use client"

import { Button } from "@/components/ui/button"

export function EmptyState({ title, description, onReset }: { title: string; description: string; onReset?: () => void }) {
  return (
    <div className="text-center py-8 border rounded-2xl">
      <div className="text-lg font-medium">{title}</div>
      <div className="text-muted-foreground mt-1">{description}</div>
      {onReset ? (
        <Button className="mt-3" variant="outline" onClick={onReset}>
          Reset filters
        </Button>
      ) : null}
    </div>
  )
}
