"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type React from "react"

type Role = "SUPER_ADMIN" | "MANAGER" | "NOC"
type User = { name: string; role: Role }

const defaultUser: User = { name: "Guest", role: "MANAGER" }

function normalizeRole(r: string): Role {
  const upper = String(r || "MANAGER")
    .toUpperCase()
    .replace(/\s+/g, "_")
  if (upper === "SUPERADMIN") return "SUPER_ADMIN"
  if (upper === "SUPER_ADMIN") return "SUPER_ADMIN"
  if (upper === "MANAGER") return "MANAGER"
  if (upper === "NOC") return "NOC"
  return "MANAGER"
}

const AuthCtx = createContext<{
  user: User
  setUser: (u: User) => void
  logout: () => void
  can: (perm: "viewTickets" | "createTicket" | "edit") => boolean
  gate: {
    isOpen: boolean
    startedAt?: string
    openedBy?: { name: string; role: Role }
    open: (by: { name: string; role: Role }) => void
    close: () => void
  }
}>({
  user: defaultUser,
  setUser: () => {},
  logout: () => {},
  can: () => false,
  gate: { isOpen: false, open: () => {}, close: () => {} },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(defaultUser)

  useEffect(() => {
    const raw = localStorage.getItem("mosaik_user")
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setUserState({
          name: parsed.name || "Guest",
          role: normalizeRole(parsed.role),
        })
      } catch (e) {
        console.error("[v0] Failed to parse user from localStorage:", e)
      }
    }
  }, [])

  const setUser = (u: User) => {
    const normalized = { ...u, role: normalizeRole(u.role) }
    setUserState(normalized)
    localStorage.setItem("mosaik_user", JSON.stringify(normalized))
  }

  const logout = () => {
    setUserState(defaultUser)
    localStorage.removeItem("mosaik_user")
  }

  const [gateState, setGateState] = useState<{
    isOpen: boolean
    startedAt?: string
    openedBy?: { name: string; role: Role }
  }>({ isOpen: false })

  useEffect(() => {
    const raw = localStorage.getItem("mosaik_create_gate")
    if (raw) setGateState(JSON.parse(raw))
  }, [])
  useEffect(() => {
    localStorage.setItem("mosaik_create_gate", JSON.stringify(gateState))
  }, [gateState])

  const gate = useMemo(() => {
    return {
      isOpen: gateState.isOpen,
      startedAt: gateState.startedAt,
      openedBy: gateState.openedBy,
      open: (by: { name: string; role: Role }) =>
        setGateState({ isOpen: true, startedAt: new Date().toISOString(), openedBy: by }),
      close: () => setGateState({ isOpen: false }),
    }
  }, [gateState])

  const can = useMemo(() => {
    return (perm: "viewTickets" | "createTicket" | "edit") => {
      if (user.role === "SUPER_ADMIN") return true

      if (perm === "createTicket") return user.role === "MANAGER"

      if (perm === "edit") return user.role === "NOC"

      if (perm === "viewTickets") {
        return user.role === "MANAGER" || user.role === "NOC"
      }
      return false
    }
  }, [user])

  const value = useMemo(() => ({ user, setUser, logout, can, gate }), [user, can, gate])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
