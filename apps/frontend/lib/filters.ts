"use client"

import { type Filters, type Role } from "@/types"

const KEY_PREFIX = "classboard:filters:"

export function loadFilters(key: string): Filters {
  try {
    const s = localStorage.getItem(KEY_PREFIX + key)
    if (!s) return defaultFilters()
    return JSON.parse(s)
  } catch {
    return defaultFilters()
  }
}

export function saveFilters(key: string, filters: Filters) {
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(filters))
  } catch {}
}

export function defaultFilters(): Filters {
  const end = new Date()
  const start = new Date(end.getTime() - 7 * 86400000)
  return { start: start.toISOString(), end: end.toISOString(), role: "all", q: "", page: 1, limit: 10, sort: "createdAt:desc" }
}

export const roleOptions: (Role | "all")[] = ["all", "admin", "teacher", "student"]
