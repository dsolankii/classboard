export type Role = "admin" | "teacher" | "student"

export type User = {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
  bio?: string
  createdAt: string // ISO
  disabled?: boolean // new: allow disabling users
}

export type Summary = {
  totalUsers: number
  totalTeachers: number
  totalStudents: number
  weeklySignups: number
  deltas: { users: number; teachers: number; students: number; weeklySignups: number } // % delta vs previous period
}

export type SignupPoint = { date: string; count: number } // for chart

export type Filters = {
  start?: string // ISO
  end?: string // ISO
  role?: Role | "all"
  q?: string
  page?: number
  limit?: number
  sort?: string // e.g., "createdAt:desc"
}
