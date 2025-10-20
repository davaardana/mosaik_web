"use client"

import AppShell from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { BackButton } from "@/components/back-button"

type ActivityLog = {
  id: string
  action: string
  user: string
  role: string
  timestamp: string
  details?: string
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/activity-log")
        const data = await res.json()
        setLogs(data.items || [])
      } catch (e) {
        console.error("[v0] Failed to load activity logs:", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
        <h1 className="text-xl font-semibold">Activity Log</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Activity Log ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-2 text-left">Timestamp</th>
                  <th className="px-3 py-2 text-left">User</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-left">Action</th>
                  <th className="px-3 py-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-3 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-3 py-2">{log.user}</td>
                    <td className="px-3 py-2">{log.role}</td>
                    <td className="px-3 py-2">{log.action}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{log.details || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
