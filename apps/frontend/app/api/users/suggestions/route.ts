import { NextResponse } from "next/server";
import { backend } from "@/lib/server/proxy";
export async function GET(req: Request) {
  const qs = new URL(req.url).search; // ?q=&limit=&scope=&mode=
  const res = await backend(`/users/suggestions${qs}`);
  return NextResponse.json(await res.json());
}
