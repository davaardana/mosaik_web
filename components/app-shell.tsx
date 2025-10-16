"use client"
import Link from "next/link"
import type React from "react"
import { ThemeToggle } from "./theme-toggle"
import { LogoutButton } from "./logout-button"
import { useTicketGate } from "./ticket-gate"

import { usePathname } from "next/navigation"
import { useAuth } from "./auth-context"
import { MosaikLogo } from "./mosaik-logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tickets", label: "Tickets" },
  { href: "/customers", label: "Customer" },
  { href: "/reports", label: "Report & Analysis" },
  { href: "/account", label: "Akun & Keamanan" },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, setUser } = useAuth()
  const { unreadCount } = useTicketGate()

  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="md:h-dvh md:sticky md:top-0 border-r bg-secondary">
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <MosaikLogo size={36} />
            <div className="font-semibold text-balance">Mosaik Ticketing System</div>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex flex-col p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm flex items-center justify-between",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <span>{item.label}</span>
                {item.label === "Tickets" && user.role === "NOC" && unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 text-xs text-muted-foreground">
          Logged in as:{" "}
          <span className="font-medium text-foreground">
            {user.name} ({user.role})
          </span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Button variant="secondary" size="sm" onClick={() => setUser({ name: "Super Admin", role: "SUPER_ADMIN" })}>
              Super Admin
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setUser({ name: "Manager", role: "MANAGER" })}>
              Manager
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setUser({ name: "NOC", role: "NOC" })}>
              NOC
            </Button>
          </div>
          <div className="mt-3">
            <LogoutButton icon={<Icon name="logout" />} />
          </div>
        </div>
      </aside>

      <main className="p-4 md:p-6">{children}</main>
    </div>
  )
}
