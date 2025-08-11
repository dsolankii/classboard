import { NextResponse } from "next/server";
import { backend } from "@/lib/server/proxy";
export async function PATCH(req: Request) {
  const body = await req.json();
  const res = await backend("/me", { method: "PATCH", body: JSON.stringify(body) });
  return NextResponse.json(await res.json());
}
