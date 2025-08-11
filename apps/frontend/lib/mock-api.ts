"use client"

import type { Filters, Role, SignupPoint, Summary, User } from "@/types"
import { isWhitelisted } from "@/lib/admin-whitelist"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// In-memory stores
let seeded = false
const users: (User & { password: string })[] = []
const tokens = new Map<string, string>() // token -> userId

function seed() {
  if (seeded) return
  seeded = true
  const roles: Role[] = ["admin", "teacher", "student"]
  const now = new Date()
  const names = [
    "Ava",
    "Noah",
    "Liam",
    "Olivia",
    "Emma",
    "Sophia",
    "Isabella",
    "Mia",
    "Amelia",
    "Harper",
    "Ethan",
    "Mason",
    "Logan",
    "Lucas",
    "Jackson",
    "Aiden",
    "Caden",
    "Grayson",
    "Elijah",
    "James",
  ]
  let id = 1
  const total = 200
  for (let i = 0; i < total; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)]
    const name = `${names[Math.floor(Math.random() * names.length)]} ${String.fromCharCode(65 + (i % 26))}`
    const daysAgo = Math.floor(Math.random() * 90)
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}${i}@example.edu`
    users.push({
      id: String(id++),
      name,
      email,
      role,
      createdAt: createdAt.toISOString(),
      password: "password123",
      bio: Math.random() > 0.8 ? "Passionate about learning and teaching." : undefined,
      avatarUrl: undefined,
      disabled: false,
    })
  }
  // Ensure demo admin (and whitelisted)
  users[0].role = "admin"
  users[0].email = "admin@classboard.local"
  users[0].password = "admin123"

  // Seed a viewer account that is NOT admin
  users.push({
    id: String(id++),
    name: "Viewer Account",
    email: "viewer@classboard.local",
    role: "student",
    createdAt: new Date().toISOString(),
    password: "viewer123",
    bio: "Read-only viewer",
    avatarUrl: undefined,
    disabled: false,
  })
}

// Helpers
function stripPassword(u: User & { password: string }): User {
  const { password, ...rest } = u
  return rest
}
function applyFilters(list: User[], filters: Filters): User[] {
  let data = [...list]
  if (filters.role && filters.role !== "all") data = data.filter((u) => u.role === filters.role)
  if (filters.q) {
    const q = filters.q.toLowerCase()
    data = data.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  if (filters.start) {
    const start = new Date(filters.start)
    data = data.filter((u) => new Date(u.createdAt) >= start)
  }
  if (filters.end) {
    const end = new Date(filters.end)
    data = data.filter((u) => new Date(u.createdAt) <= end)
  }
  // Sort
  const sort = filters.sort ?? "createdAt:desc"
  const [field, dir] = sort.split(":")
  data.sort((a: any, b: any) => {
    if (field === "createdAt") {
      const da = new Date(a.createdAt).getTime()
      const db = new Date(b.createdAt).getTime()
      return dir === "asc" ? da - db : db - da
    }
    return 0
  })
  return data
}
function pctDelta(curr: number, prev: number) {
  if (prev === 0) return curr === 0 ? 0 : 100
  return Math.round(((curr - prev) / prev) * 100)
}
function requireAdmin(token: string) {
  const id = tokens.get(token)
  if (!id) throw new Error("Unauthorized")
  const u = users.find((x) => x.id === id)
  if (!u) throw new Error("Unauthorized")
  if (u.role === "admin" || isWhitelisted(u.email)) return u
  throw new Error("Forbidden: admin only")
}

// Quick, dedicated search for suggestions (no pagination, top N by recency)
export async function searchUsers(q: string, limit = 8): Promise<User[]> {
  seed()
  await delay(150)
  const term = q.trim().toLowerCase()
  if (!term) return []
  const matches = users
    .map(stripPassword)
    .filter((u) => !u.disabled)
    .filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, Math.max(1, Math.min(50, limit)))
  return matches
}

// Auth-like functions
export async function register(input: { name: string; email: string; password: string; role: Role }): Promise<{
  token: string
}> {
  seed()
  await delay(500)
  const exists = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase())
  if (exists) throw new Error("Email already registered")
  const newUser: User & { password: string } = {
    id: String(users.length + 1),
    name: input.name,
    email: input.email.toLowerCase(),
    role: isWhitelisted(input.email) ? "admin" : input.role,
    createdAt: new Date().toISOString(),
    password: input.password,
    bio: "",
    avatarUrl: undefined,
    disabled: false,
  }
  users.unshift(newUser)
  const token = `token_${crypto.randomUUID()}`
  tokens.set(token, newUser.id)
  return { token }
}

export async function login(input: { email: string; password: string }): Promise<{ token: string }> {
  seed()
  await delay(500)
  const idx = users.findIndex(
    (x) => x.email.toLowerCase() === input.email.toLowerCase() && x.password === input.password,
  )
  if (idx === -1) throw new Error("Invalid credentials")
  // Auto-promote if whitelisted
  if (isWhitelisted(users[idx].email) && users[idx].role !== "admin") {
    users[idx] = { ...users[idx], role: "admin" }
  }
  const token = `token_${crypto.randomUUID()}`
  tokens.set(token, users[idx].id)
  return { token }
}

export async function getMe(token: string): Promise<User> {
  seed()
  await delay(300)
  const id = tokens.get(token)
  if (!id) throw new Error("Unauthorized")
  const { password, ...user } = users.find((u) => u.id === id)!
  return user
}

export async function updateMe(token: string, patch: Partial<Pick<User, "name" | "bio" | "avatarUrl">>): Promise<User> {
  seed()
  await delay(400)
  const id = tokens.get(token)
  if (!id) throw new Error("Unauthorized")
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error("User not found")
  users[idx] = { ...users[idx], ...patch }
  const { password, ...user } = users[idx]
  return user
}

// Admin-only management functions
export async function updateUserById(
  token: string,
  id: string,
  patch: Partial<Pick<User, "name" | "role" | "bio" | "disabled">>,
): Promise<User> {
  seed()
  await delay(300)
  requireAdmin(token)
  const idx = users.findIndex((x) => x.id === id)
  if (idx === -1) throw new Error("User not found")
  users[idx] = { ...users[idx], ...patch }
  const { password, ...user } = users[idx]
  return user
}

/**
 * Create a user (admin only).
 * Accepts optional createdAt ISO string for precise day bucketing (UTC).
 */
export async function createUser(
  token: string,
  input: { name: string; email: string; role: Role; bio?: string; createdAt?: string },
): Promise<User> {
  seed()
  await delay(300)
  requireAdmin(token)
  const exists = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase())
  if (exists) throw new Error("Email already exists")
  const when = input.createdAt ? new Date(input.createdAt) : new Date()
  const u: User & { password: string } = {
    id: String(users.length + 1),
    name: input.name,
    email: input.email.toLowerCase(),
    role: input.role,
    bio: input.bio ?? "",
    createdAt: when.toISOString(),
    password: "password123",
    avatarUrl: undefined,
    disabled: false,
  }
  users.unshift(u)
  const { password, ...user } = u
  return user
}

export async function deleteUserById(token: string, id: string): Promise<{ success: true }> {
  seed()
  await delay(300)
  requireAdmin(token)
  const idx = users.findIndex((x) => x.id === id)
  if (idx === -1) throw new Error("User not found")
  users.splice(idx, 1)
  return { success: true }
}

// Metrics (exclude disabled so charts reflect enable/disable)
export async function getSummary(filters: Filters): Promise<Summary> {
  seed()
  await delay(400)
  const filtered = applyFilters(users.map(stripPassword), filters).filter((u) => !u.disabled)
  const totalUsers = filtered.length
  const totalTeachers = filtered.filter((u) => u.role === "teacher").length
  const totalStudents = filtered.filter((u) => u.role === "student").length

  const end = filters.end ? new Date(filters.end) : new Date()
  const start = filters.start ? new Date(filters.start) : new Date(end.getTime() - 30 * 86400000)
  const currentStart = new Date(end.getTime() - 7 * 86400000)
  const prevStart = new Date(end.getTime() - 14 * 86400000)
  const prevEnd = new Date(end.getTime() - 7 * 86400000)

  const weeklySignups = filtered.filter((u) => {
    const d = new Date(u.createdAt)
    return d >= currentStart && d <= end
  }).length

  const prevWeekly = applyFilters(users.map(stripPassword), {
    ...filters,
    start: prevStart.toISOString(),
    end: prevEnd.toISOString(),
  }).filter((u) => !u.disabled).length

  const rangeDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000))
  const prevRangeStart = new Date(start.getTime() - rangeDays * 86400000)
  const prevRangeEnd = new Date(start.getTime())

  const currRangeUsers = users
    .map(stripPassword)
    .filter((u) => !u.disabled)
    .filter((u) => new Date(u.createdAt) >= start && new Date(u.createdAt) <= end)

  const prevRangeUsers = users
    .map(stripPassword)
    .filter((u) => !u.disabled)
    .filter((u) => new Date(u.createdAt) >= prevRangeStart && new Date(u.createdAt) <= prevRangeEnd)

  const deltas = {
    users: pctDelta(currRangeUsers.length, prevRangeUsers.length),
    teachers: pctDelta(
      currRangeUsers.filter((u) => u.role === "teacher").length,
      prevRangeUsers.filter((u) => u.role === "teacher").length,
    ),
    students: pctDelta(
      currRangeUsers.filter((u) => u.role === "student").length,
      prevRangeUsers.filter((u) => u.role === "student").length,
    ),
    weeklySignups: pctDelta(weeklySignups, prevWeekly),
  }

  return { totalUsers, totalTeachers, totalStudents, weeklySignups, deltas }
}

export async function getSignups(filters: Filters): Promise<SignupPoint[]> {
  seed()
  await delay(400)

  // Use UTC day keys so the graph matches the table's Joined (iso slice)
  const rawEnd = filters.end ? new Date(filters.end) : new Date()
  const rawStart = filters.start ? new Date(filters.start) : new Date(rawEnd.getTime() - 30 * 86400000)
  const startKey = rawStart.toISOString().slice(0, 10)
  const endKey = rawEnd.toISOString().slice(0, 10)

  const list = users
    .map(stripPassword)
    .filter((u) => !u.disabled)
    .filter((u) => (filters.role && filters.role !== "all" ? u.role === filters.role : true))
    .filter((u) => {
      if (!filters.q) return true
      const q = filters.q.toLowerCase()
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    })

  const counts = new Map<string, number>()
  for (const u of list) {
    const key = new Date(u.createdAt).toISOString().slice(0, 10)
    if (key < startKey || key > endKey) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const points: SignupPoint[] = []
  const cursor = new Date(startKey + "T00:00:00.000Z")
  while (cursor.toISOString().slice(0, 10) <= endKey) {
    const key = cursor.toISOString().slice(0, 10)
    points.push({ date: key.replace(/-/g, "/"), count: counts.get(key) ?? 0 })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return points
}

// Users listing (with pagination)
export async function getUsers(filters: Filters): Promise<{ data: User[]; page: number; total: number }> {
  seed()
  await delay(500)
  const all = applyFilters(users.map(stripPassword), filters)
  const page = Math.max(1, filters.page ?? 1)
  const limit = Math.max(1, Math.min(100, filters.limit ?? 10))
  const start = (page - 1) * limit
  const data = all.slice(start, start + limit)
  return { data, page, total: all.length }
}

export async function getUserById(id: string): Promise<User> {
  seed()
  await delay(300)
  const u = users.find((x) => x.id === id)
  if (!u) throw new Error("User not found")
  const { password, ...user } = u
  return user
}
