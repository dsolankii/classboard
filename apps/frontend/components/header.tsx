"use client"

import React from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthContext } from "@/components/protected-layout"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { service } from "@/lib/api"
import type { User } from "@/types"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { loadFilters, defaultFilters } from "@/lib/filters"
import { motion } from "framer-motion"

export function Header() {
  const { user } = React.useContext(AuthContext)
  const router = useRouter()
  const params = useSearchParams()

  const searchRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [query, setQuery] = React.useState<string>("")
  const debounced = useDebouncedValue(query, 250)

  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [items, setItems] = React.useState<User[]>([])
  const [activeIdx, setActiveIdx] = React.useState(-1)

  const [savedUsersFilters, setSavedUsersFilters] = React.useState(() => {
    if (typeof window === "undefined") return defaultFilters()
    try {
      return loadFilters("users")
    } catch {
      return defaultFilters()
    }
  })
  const savedUsersFiltersRef = React.useRef(savedUsersFilters)
  React.useEffect(() => {
    savedUsersFiltersRef.current = savedUsersFilters
  }, [savedUsersFilters])

  // Initialize from URL once; then user controls it
  const didInitFromUrl = React.useRef(false)
  React.useEffect(() => {
    if (didInitFromUrl.current) return
    didInitFromUrl.current = true
    const q = params?.get("q") || ""
    setQuery(q)
  }, [params])

  React.useEffect(() => {
    try {
      const f = loadFilters("users")
      setSavedUsersFilters(f)
    } catch {}
  }, [])

  // Fetch suggestions when typing (1+ chars) from the same dataset as the Users table.
  // We intentionally ignore date/role limits here for reliable matches.
  React.useEffect(() => {
    let ignore = false
    const q = (debounced || "").trim()

    if (q.length < 1) {
      setItems([])
      setOpen(false)
      setActiveIdx(-1)
      return
    }

    setOpen(true) // show panel immediately
    setLoading(true)
;(async () => {
  setLoading(true);
  try {
    const res = await service.getUsers({
      q,
      scope: "name",
      mode: "startsWith",
      role: "all",
      page: 1,
      limit: 8,
      sort: "createdAt:desc",
    });
    if (ignore) return;
    setItems(res.data);        // getUsers returns { data, page, total }
    setActiveIdx(-1);
  } catch {
    if (!ignore) setItems([]);
  } finally {
    if (!ignore) setLoading(false);
  }
})();

    return () => {
      ignore = true
    }
  }, [debounced])

  // Keyboard shortcuts: "/" to focus, Ctrl/Cmd+F to toggle filters
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName || "")) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (
        e.key.toLowerCase() === "f" &&
        (e.ctrlKey || e.metaKey || !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName || ""))
      ) {
        const ev = new CustomEvent("classboard:toggle-filters")
        window.dispatchEvent(ev)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Close suggestions on outside click
  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  function goToUsers(q: string) {
    const next = q.trim()
    if (next.length > 0) router.push(`/users?q=${encodeURIComponent(next)}`)
    else router.push(`/users`)
    setOpen(false)
    searchRef.current?.blur()
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (activeIdx >= 0 && items[activeIdx]) {
        goToUsers(items[activeIdx].email)
      } else {
        goToUsers(query)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, items.length - 1))
      setOpen(true)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <header role="banner" className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-10 w-full items-center gap-2 px-3 md:px-4">
        {/* Search */}
        <div ref={containerRef} className="relative flex-1">
          <Search className="pointer-events-none absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <label htmlFor="global-search" className="sr-only">
            Global search
          </label>
          <Input
            id="global-search"
            ref={searchRef}
            placeholder="Search users by name or email (press '/')"
            value={query}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value)
              const val = e.target.value.trim()
              if (val.length >= 1) setOpen(true)
            }}
            onKeyDown={onKeyDown}
            onFocus={() => {
              const q = (query || "").trim()
              if (q.length >= 1) setOpen(true)
            }}
            className="h-8 pl-7 text-sm"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="global-search-listbox"
            aria-label="Global search"
          />

          {/* Suggestions panel (accessible listbox) */}
          {open && (
            <div
              id="global-search-listbox"
              role="listbox"
              aria-label="Search suggestions"
              className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
            >
              {loading ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">Searching…</div>
              ) : items.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">No matches</div>
              ) : (
                items.map((u, i) => (
                  <button
                    key={u.id}
                    role="option"
                    aria-selected={activeIdx === i}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseDown={(e) => {
                      // Navigate immediately on mousedown to avoid focus/blur issues
                      e.preventDefault()
                      goToUsers(u.name)
                    }}
                    onClick={() => goToUsers(u.name)}
                    className={[
                      "flex w-full items-center gap-3 px-3 py-2 text-left text-sm",
                      activeIdx === i ? "bg-muted" : "hover:bg-muted/70",
                    ].join(" ")}
                  >
                    <img
                      src={u.avatarUrl || "/placeholder.svg?height=24&width=24&query=avatar"}
                      alt=""
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium leading-tight">{u.name}</span>
                      <span className="text-xs text-muted-foreground leading-tight">{u.email}</span>
                    </div>
                    <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px]">{u.role}</span>
                  </button>
                ))
              )}
              <div className="border-t px-3 py-1.5 text-[11px] text-muted-foreground">
                Press Enter to search all results · Arrow keys to navigate
              </div>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-1 flex items-center gap-1.5">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-transparent"
                aria-label="Open user menu"
              >
                <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex">
                  <Image
                    src={user?.avatarUrl || "/placeholder.svg?height=28&width=28&query=profile%20avatar"}
                    alt="User avatar"
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                </motion.span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-sm">{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                 onClick={async () => {
   await service.logout()
   router.replace("/login")
 }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
