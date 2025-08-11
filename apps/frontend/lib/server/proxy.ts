// lib/server/proxy.ts
import "server-only";
import { cookies } from "next/headers";

const BASE = process.env.BACKEND_URL ?? "http://localhost:4000";
const COOKIE = process.env.SESSION_COOKIE_NAME ?? "classboard_session";

export async function backend(path: string, init: RequestInit = {}) {
  const token = (await cookies()).get(COOKIE)?.value;
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(`${BASE}${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    // throw the Response so route handlers can preserve status
    throw new Response(await res.text(), { status: res.status });
  }
  return res;
}

export async function setSessionCookie(token: string, maxAgeDays = 7) {
  const c = await cookies();              // ✅ await first
  c.set({
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * maxAgeDays,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();              // ✅ await first
  c.delete(COOKIE);
}
