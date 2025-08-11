"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { Search, X } from "lucide-react"

export function SearchInput({
  value,
  onChange,
  placeholder = "Search name or email",
  delay = 300,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  delay?: number
}) {
  const [inner, setInner] = React.useState(value)
  const debounced = useDebouncedValue(inner, delay)

  React.useEffect(() => {
    onChange(debounced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  React.useEffect(() => {
    setInner(value)
  }, [value])

  const clear = () => {
    setInner("")
    onChange("")
  }

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      {inner ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={clear}
          className="absolute right-2.5 top-2.5 rounded p-0.5 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      <Input
        value={inner}
        onChange={(e) => setInner(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8"
        aria-label="Search"
      />
    </div>
  )
}
