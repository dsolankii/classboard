import { NextResponse } from "next/server";
import { backend } from "@/lib/server/proxy";

export async function GET() {
  try {
    const res = await backend("/me");
    return NextResponse.json(await res.json());
  } catch (e: any) {
    if (e instanceof Response) {
      const status = e.status || 500;
      let text = "";
      try { text = await e.text(); } catch {}
      try { return NextResponse.json(JSON.parse(text), { status }); }
      catch { return NextResponse.json({ message: text || "Error" }, { status }); }
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
