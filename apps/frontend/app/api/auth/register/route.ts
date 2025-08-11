import { NextResponse } from "next/server";
import { backend, setSessionCookie } from "@/lib/server/proxy";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const res = await backend("/auth/register", { method: "POST", body: JSON.stringify(body) });
    const data = await res.json(); // { token }
    await setSessionCookie(data.token);      // ✅ await
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e instanceof Response) {
      const status = e.status || 500;
      const text = await e.text().catch(() => "");
      try { return NextResponse.json(JSON.parse(text), { status }); }
      catch { return NextResponse.json({ message: text || "Error" }, { status }); }
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
