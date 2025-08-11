"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Settings, User2, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// Menu items
const items = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/users", icon: Users },
  { title: "Profile", href: "/profile", icon: User2 },
  { title: "Settings", href: "/settings", icon: Settings },
]

// Sidebar with arrow + brand in the header.
// Brand text smoothly fades out in icon (collapsed) mode using sidebar data attributes [^3].
export function AppSidebar() {
  const pathname = usePathname()
  const { state, toggleSidebar } = useSidebar()
  const expanded = state === "expanded"

  return (
    <Sidebar collapsible="icon" className="bg-background text-foreground">
      <SidebarHeader className="px-2">
        <div className="flex items-center justify-between px-1 py-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              onClick={toggleSidebar}
              className="h-8 w-8"
            >
              <motion.div
                animate={{ rotate: expanded ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.div>
            </Button>
            <Link
              href="/dashboard"
              className={[
                "text-sm font-semibold tracking-tight",
                "transition-all duration-200",
                "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:-ml-8",
              ].join(" ")}
              aria-label="Classboard"
            >
              Classboard
            </Link>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname?.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={!!active}
                      tooltip={item.title}
                      size="default"
                      className="rounded-md"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={[
                            "sidebar-icon-chip",
                            active ? "border-primary/30 bg-primary/10 text-primary" : "",
                            "group-data-[collapsible=icon]:mx-auto",
                          ].join(" ")}
                        >
                          <item.icon className="h-5 w-5" />
                        </span>
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 text-[11px] text-muted-foreground">v1.0.0</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
