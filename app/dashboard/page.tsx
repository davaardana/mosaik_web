"use client"
import AppShell from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"
import { BackButton } from "@/components/back-button"
import { useEffect, useMemo, useState } from "react"

export default function DashboardPage() {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch("/api/tickets")
        const j = await r.json()
        setItems(j.items || [])
      } catch {}
    })()
  }, [])

  const [countNew, countProgress, countDone] = useMemo(() => {
    let n = 0,
      p = 0,
      d = 0
    for (const t of items) {
      const s = String(t.status || "").toUpperCase()
      if (s === "OPEN") n++
      else if (s === "IN_PROGRESS") p++
      else d++
    }
    return [n, p, d]
  }, [items])

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-2">
        <BackButton />
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tiket Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{countNew}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dalam Proses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{countProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{countDone}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              id="tickets-overview"
              className="w-full"
              config={{
                new: { label: "New", color: "hsl(var(--primary))" },
                progress: { label: "In Progress", color: "hsl(var(--muted-foreground))" },
                done: { label: "Closed", color: "hsl(var(--accent))" },
              }}
            >
              <BarChart data={[{ name: "This Week", new: countNew, progress: countProgress, done: countDone }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="new" fill="var(--color-new)" />
                <Bar dataKey="progress" fill="var(--color-progress)" />
                <Bar dataKey="done" fill="var(--color-done)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
