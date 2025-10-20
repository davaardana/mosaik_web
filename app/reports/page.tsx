"use client"

import AppShell from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { BackButton } from "@/components/back-button"

type Ticket = {
  id: string
  ticketNo: string
  customer?: { company: string; branch?: string; region?: string; sid?: string }
  status: string
}

type Customer = {
  id: string
  company: string
  branch?: string
  region?: string
  sid?: string
  isp?: string
}

export default function ReportsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [tRes, cRes] = await Promise.all([fetch("/api/tickets"), fetch("/api/customers")])
        const tData = await tRes.json()
        const cData = await cRes.json()
        setTickets(tData.items || [])
        setCustomers(cData.items || [])
      } catch (e) {
        console.error("[v0] Failed to load reports:", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function exportExcel() {
    try {
      // Create workbook-like CSV with headers and styling info
      const timestamp = new Date().toLocaleString("id-ID")
      const lines = [
        ["LAPORAN TICKETS - PT. MOSAIK INTEGRASI SOLUSINDO"],
        [`Generated: ${timestamp}`],
        [],
        ["No Ticket", "Customer", "Cabang", "Daerah", "Status"],
        ...tickets.map((r) => [
          r.ticketNo,
          r.customer?.company || "-",
          r.customer?.branch || "-",
          r.customer?.region || "-",
          r.status,
        ]),
        [],
        [],
        ["LAPORAN CUSTOMERS - PT. MOSAIK INTEGRASI SOLUSINDO"],
        [`Generated: ${timestamp}`],
        [],
        ["Pusat", "Cabang", "Daerah", "SID", "ISP"],
        ...customers.map((r) => [r.company, r.branch || "-", r.region || "-", r.sid || "-", r.isp || "-"]),
      ]

      const csv = lines.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report-mosaik-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error("[v0] Excel export failed:", e)
      alert("Excel export gagal. Silakan coba lagi.")
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
        <h1 className="text-xl font-semibold">Report & Analysis</h1>
      </div>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Report & Analysis</CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportExcel}>
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="font-semibold mb-2">Tickets ({tickets.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">No Ticket</th>
                    <th className="px-3 py-2 text-left">Customer</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-muted/50">
                      <td className="px-3 py-2 font-mono text-xs">{r.ticketNo}</td>
                      <td className="px-3 py-2">
                        <div className="font-semibold">{r.customer?.company}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.customer?.branch} ({r.customer?.region})
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            r.status === "OPEN"
                              ? "bg-yellow-100 text-yellow-800"
                              : r.status === "CLOSED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Customers ({customers.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Pusat</th>
                    <th className="px-3 py-2 text-left">Cabang</th>
                    <th className="px-3 py-2 text-left">Daerah</th>
                    <th className="px-3 py-2 text-left">SID</th>
                    <th className="px-3 py-2 text-left">ISP</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-muted/50">
                      <td className="px-3 py-2 font-semibold">{r.company}</td>
                      <td className="px-3 py-2">{r.branch || "-"}</td>
                      <td className="px-3 py-2">{r.region || "-"}</td>
                      <td className="px-3 py-2 font-mono text-xs">{r.sid || "-"}</td>
                      <td className="px-3 py-2">{r.isp || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </CardContent>
      </Card>
    </AppShell>
  )
}
