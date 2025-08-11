import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/server/proxy";

export async function POST() {
  await clearSessionCookie();              // ✅ await
  return NextResponse.json({ ok: true });
}
