"use client";

import { service } from "@/lib/api";
import type { User } from "@/types";

// keep names so other files compile, but no localStorage anymore
export function setToken(_t: string | null) {}
export function getToken(): string | null { return null; }
export async function getCurrentUser(): Promise<User> {
  return service.getMe();
}
