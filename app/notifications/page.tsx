"use client"

import AppShell from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { BackButton } from "@/components/back-button"

type Notification = {
  id: string
  message: string
  type: "info" | "warning" | "error" | "success"
  createdAt: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/notifications")
        const data = await res.json()
        setNotifications(data.items || [])
      } catch (e) {
        console.error("[v0] Failed to load notifications:", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" })
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (e) {
      console.error("[v0] Failed to mark notification as read:", e)
    }
  }

  if (loading)
    return (
      <AppShell>
        <div>Loading...</div>
      </AppShell>
    )

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-2">
        <BackButton />
        <h1 className="text-xl font-semibold">Notifications</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notifikasi ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada notifikasi</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-md border flex items-start justify-between ${
                    n.read ? "bg-muted/30" : "bg-primary/10 border-primary"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{n.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.read && (
                    <Button size="sm" variant="ghost" onClick={() => markAsRead(n.id)}>
                      Mark Read
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
