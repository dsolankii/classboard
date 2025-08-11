"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { service } from "@/lib/api";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        // if logged in (cookie set), go to dashboard
        await service.getMe();
        if (on) router.replace("/dashboard");
      } catch {
        // not logged in → go to landing
        if (on) router.replace("/landing-page");
      }
    })();
    return () => {
      on = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-muted-foreground">Loading…</div>
    </div>
  );
}
