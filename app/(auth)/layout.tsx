"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === "/login"
  const isRegister = pathname === "/register"

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr] bg-background">
      {/* Header sederhana sesuai pola PDF: logo + nama web kiri, menu Login/Register kanan */}
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm md:text-base">Mosaik Ticketing System</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login" aria-current={isLogin ? "page" : undefined}>
              <Button variant={isLogin ? "default" : "ghost"} size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register" aria-current={isRegister ? "page" : undefined}>
              <Button variant={isRegister ? "default" : "outline"} size="sm">
                Register
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Konten halaman (form login/register) */}
      <div className="grid place-items-center px-4 py-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
