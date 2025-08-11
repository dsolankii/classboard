"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { service } from "@/lib/api";
import { PreferencesProvider } from "@/lib/preferences";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { PageTransition } from "@/components/page-transition";
import { BackgroundOrbs } from "@/components/background-orbs";

export const AuthContext = React.createContext<{ user: any; setUser: (u: any) => void }>({
  user: null,
  setUser: () => {},
});

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;

    async function init() {
      try {
        // fetch the current user via our Next /api proxy (cookie session)
        const me = await service.getMe();
        if (active) setUser(me);
      } catch {
        // not logged in → go to login and preserve where we were going
        router.replace("/login?next=" + encodeURIComponent(pathname || "/dashboard"));
      } finally {
        if (active) setLoading(false);
      }
    }

    init();
    return () => {
      active = false;
    };
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <PreferencesProvider>
        <div className="relative app-dots-bg min-h-svh">
          <BackgroundOrbs />
          <SidebarProvider
            defaultOpen
            style={{ "--sidebar-width": "12rem", "--sidebar-width-icon": "3.25rem" } as React.CSSProperties}
          >
            <AppSidebar />
            <SidebarInset className="bg-transparent">
              <Header />
              <PageTransition>
                <main role="main" aria-label="Main content" className="relative z-[1] mx-auto max-w-7xl p-3 md:p-5">
                  {children}
                </main>
              </PageTransition>
            </SidebarInset>
          </SidebarProvider>
        </div>
        <Toaster />
      </PreferencesProvider>
    </AuthContext.Provider>
  );
}
