"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { LogOut, Bell, User, Sun, Moon, Ticket, FileText, Users, LayoutDashboard } from "lucide-react"

type IconName = "logout" | "bell" | "user" | "sun" | "moon" | "ticket" | "report" | "customers" | "dashboard"

const MAP: Record<IconName, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  logout: LogOut,
  bell: Bell,
  user: User,
  sun: Sun,
  moon: Moon,
  ticket: Ticket,
  report: FileText,
  customers: Users,
  dashboard: LayoutDashboard,
}

export function Icon({
  name,
  className,
  size = 16,
  strokeWidth = 2,
  ...rest
}: {
  name: IconName
  className?: string
  size?: number
  strokeWidth?: number
} & React.SVGProps<SVGSVGElement>) {
  const Cmp = MAP[name]
  return <Cmp className={cn("shrink-0", className)} width={size} height={size} strokeWidth={strokeWidth} {...rest} />
}
