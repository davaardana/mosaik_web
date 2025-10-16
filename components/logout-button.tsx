"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth() // call context logout

  return (
    <button
      type="button" // explicit button
      onClick={() => {
        try {
          logout()
        } catch {}
        router.push("/login")
      }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
      aria-label="Logout"
      title="Logout"
    >
      <LogOut className="h-4 w-4" />
    </button>
  )
}
