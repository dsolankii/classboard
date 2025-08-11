import { NextResponse } from "next/server";
import { backend } from "@/lib/server/proxy";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await backend(`/users/${params.id}`);
  return NextResponse.json(await res.json());
}
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const res = await backend(`/users/${params.id}`, { method: "PATCH", body: JSON.stringify(body) });
  return NextResponse.json(await res.json());
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const res = await backend(`/users/${params.id}`, { method: "DELETE" });
  return NextResponse.json(await res.json());
}
