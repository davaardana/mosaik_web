"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Role = "SUPER_ADMIN" | "MANAGER" | "NOC"

export type CustomerRef = {
  pusat: string
  cabang?: string
  daerah?: string
  sid?: string
  isp?: string
}

export type Ticket = {
  id: string
  number: string
  createdAt: string
  gateOpenedAt: string
  createdByRole: Role
  createdByUser?: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
  customer?: CustomerRef
  lokasiTrouble?: string
  problem?: string
  solusi?: string
  photos?: string[]
  resolvedAt?: string
}

type Notification = {
  id: string
  type: "ticket-created"
  message: string
  createdAt: string
  ticketId: string
  unread: boolean
}

type TicketGateContextType = {
  tickets: Ticket[]
  notifications: Notification[]
  unreadCount: number
  createGate: (role: Role, userName?: string) => Ticket
  updateTicket: (role: Role, ticketId: string, patch: Partial<Ticket>) => void
  markAllRead: () => void
  canEdit: (role: Role) => boolean
  nocCanEditNow: (ticketId: string) => boolean
}

const TicketGateContext = createContext<TicketGateContextType | null>(null)

const STORAGE_TICKETS = "mosaik:tickets"
const STORAGE_NOTIFS = "mosaik:notifs"

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

function nextDailySequence(): string {
  const key = "mosaik:ticket-seq"
  const today = new Date()
  const d = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(
    2,
    "0",
  )}`
  const raw = load<{ day: string; seq: number }>(key, { day: d, seq: 0 })
  const seq = raw.day === d ? raw.seq + 1 : 1
  save(key, { day: d, seq })
  return `${d}-${String(seq).padStart(3, "0")}`
}

export function TicketGateProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(() => load<Ticket[]>(STORAGE_TICKETS, []))
  const [notifications, setNotifications] = useState<Notification[]>(() => load<Notification[]>(STORAGE_NOTIFS, []))

  // Broadcast for NOC notifications across tabs
  useEffect(() => {
    const bc = new BroadcastChannel("mosaik:bus")
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "sync") {
        setTickets(load<Ticket[]>(STORAGE_TICKETS, []))
        setNotifications(load<Notification[]>(STORAGE_NOTIFS, []))
      }
    }
    bc.addEventListener("message", onMsg)
    return () => bc.close()
  }, [])

  useEffect(() => {
    save(STORAGE_TICKETS, tickets)
    const bc = new BroadcastChannel("mosaik:bus")
    bc.postMessage({ type: "sync" })
    bc.close()
  }, [tickets])
  useEffect(() => {
    save(STORAGE_NOTIFS, notifications)
  }, [notifications])

  const createGate = (role: Role, userName?: string): Ticket => {
    if (role !== "MANAGER" && role !== "SUPER_ADMIN") {
      throw new Error("Hanya Manager/Super Admin yang bisa Create Ticket")
    }
    const now = new Date().toISOString()
    const ticket: Ticket = {
      id: crypto.randomUUID(),
      number: nextDailySequence(),
      createdAt: now,
      gateOpenedAt: now,
      status: "OPEN",
      createdByRole: role,
      createdByUser: userName,
      photos: [],
    }
    setTickets((prev) => [ticket, ...prev])

    // Notify NOC
    const notif: Notification = {
      id: crypto.randomUUID(),
      type: "ticket-created",
      message: `Tiket ${ticket.number} telah dibuka. NOC dapat mulai mengisi.`,
      createdAt: now,
      ticketId: ticket.id,
      unread: true,
    }
    setNotifications((n) => [notif, ...n])
    return ticket
  }

  const updateTicket = (role: Role, ticketId: string, patch: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t
        // Permissions: MANAGER tidak boleh edit; NOC boleh edit setelah gate; SUPER_ADMIN boleh edit selalu
        const allow = role === "SUPER_ADMIN" || (role === "NOC" && Boolean(t.gateOpenedAt)) ? true : false
        if (!allow) return t
        return { ...t, ...patch }
      }),
    )
  }

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))

  const nocCanEditNow = (ticketId: string) => {
    const t = tickets.find((x) => x.id === ticketId)
    return Boolean(t?.gateOpenedAt)
  }

  const value = useMemo<TicketGateContextType>(
    () => ({
      tickets,
      notifications,
      unreadCount: notifications.filter((n) => n.unread).length,
      createGate,
      updateTicket,
      markAllRead,
      canEdit: (role: Role) => role === "SUPER_ADMIN" || role === "NOC",
      nocCanEditNow,
    }),
    [tickets, notifications],
  )

  return <TicketGateContext.Provider value={value}>{children}</TicketGateContext.Provider>
}

export function useTicketGate() {
  const ctx = useContext(TicketGateContext)
  if (!ctx) throw new Error("useTicketGate must be used within TicketGateProvider")
  return ctx
}
