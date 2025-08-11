import { NextResponse } from "next/server";
import { backend } from "@/lib/server/proxy";
export async function GET(req: Request) {
  const qs = new URL(req.url).search;
  const res = await backend(`/metrics/summary${qs}`);
  return NextResponse.json(await res.json());
}
