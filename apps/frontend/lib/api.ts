// lib/api.ts — client-side helpers that call our Next API routes
type Role = "admin" | "teacher" | "student";
type User = {
  id?: string; _id?: string;
  name: string; email: string; role: Role;
  bio?: string; avatarUrl?: string; disabled?: boolean;
  preferences?: { theme?: "system"|"light"|"dark"; density?: "comfortable"|"compact"; language?: string };
  createdAt?: string; updatedAt?: string;
};
type Summary = {
  totalUsers: number; totalTeachers: number; totalStudents: number;
  weeklySignups: number; deltas: { users: number; teachers: number; students: number; weeklySignups: number };
};
type SignupPoint = { date: string; count: number };

async function j<T>(p: Promise<Response>) {
  const r = await p;
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as T;
}

// AUTH
export const service = {
  async register(p: { name: string; email: string; password: string; role: "admin"|"teacher"|"student" }) {
    await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(p) });
    return { ok: true as const };
  },
  async login(p: { email: string; password: string }) {
    await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(p) });
    return { ok: true as const };
  },
  async logout() { await fetch("/api/auth/logout", { method: "POST" }); },
  async getMe(): Promise<User> { return j(fetch("/api/auth/me")); },
  async updateMe(p: Partial<User>): Promise<User> {
    return j(fetch("/api/me", { method: "PATCH", body: JSON.stringify(p) }));
  },

  // METRICS
  async getSummary(qs: Record<string, string | number | undefined>): Promise<Summary> {
    const s = new URLSearchParams(qs as any).toString();
    return j(fetch(`/api/metrics/summary?${s}`));
  },
  async getSignups(qs: Record<string, string | number | undefined>): Promise<SignupPoint[]> {
    const s = new URLSearchParams(qs as any).toString();
    return j(fetch(`/api/metrics/signups?${s}`));
  },

  // USERS
  async getUsers(qs: Record<string, string | number | undefined>) {
    const s = new URLSearchParams(qs as any).toString();
    return j(fetch(`/api/users?${s}`));
  },
  async getUserById(id: string): Promise<User> {
    return j(fetch(`/api/users/${id}`));
  },
  async createUser(p: { name: string; email: string; password: string; role: Role; bio?: string; avatarUrl?: string }) {
    return j(fetch(`/api/users`, { method: "POST", body: JSON.stringify(p) }));
  },
  async updateUserById(id: string, p: Partial<User>) {
    return j(fetch(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(p) }));
  },
  async deleteUserById(id: string) {
    return j(fetch(`/api/users/${id}`, { method: "DELETE" }));
  },
  async bulkUpdate(ids: string[], payload: { disabled?: boolean; role?: Role }) {
    return j(fetch(`/api/users/bulk`, { method: "PATCH", body: JSON.stringify({ ids, ...payload }) }));
  },
  async suggestions(q: string, opts?: { limit?: number; scope?: "name"|"email"|"all"; mode?: "startsWith"|"contains" }) {
    const s = new URLSearchParams({ q, limit: String(opts?.limit ?? 8), scope: opts?.scope ?? "name", mode: opts?.mode ?? "startsWith" });
    return j(fetch(`/api/users/suggestions?${s.toString()}`));
  },
};