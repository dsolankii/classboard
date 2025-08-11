import { NextResponse } from "next/server";
import { backend } from "@/lib/server/proxy";

export async function GET(req: Request) {
  const qs = new URL(req.url).search;
  const res = await backend(`/users${qs}`);
  return NextResponse.json(await res.json());
}
export async function POST(req: Request) {
  const body = await req.json();
  const res = await backend("/users", { method: "POST", body: JSON.stringify(body) });
  return NextResponse.json(await res.json(), { status: 201 });
}
