"use client"

import ProtectedLayout from "@/components/protected-layout"

// Layout for protected routes with Sidebar and Header.
// Uses shadcn/ui Sidebar primitives as documented [^4].
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}
