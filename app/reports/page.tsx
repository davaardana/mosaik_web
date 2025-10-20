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

  async function exportPDF() {
    const { jsPDF } = await import("jspdf")
    await import("jspdf-autotable")
    const doc = new jsPDF()

    // Header
    doc.setFontSize(14)
    doc.text("Laporan Tickets", 14, 16)
    ;(doc as any).autoTable({
      startY: 20,
      head: [["No Ticket", "Customer", "Status"]],
      body: tickets.map((r) => [
        r.ticketNo,
        `${r.customer?.company || "-"} - ${r.customer?.branch || "-"} (${r.customer?.region || "-"})`,
        r.status,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [3, 105, 161] },
    })

    const y = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.text("Laporan Customers", 14, y)
    ;(doc as any).autoTable({
      startY: y + 4,
      head: [["Pusat", "Cabang", "Daerah", "SID", "ISP"]],
      body: customers.map((r) => [r.company, r.branch || "-", r.region || "-", r.sid || "-", r.isp || "-"]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [3, 105, 161] },
    })

    doc.save("report-mosaik.pdf")
  }

  function exportCSV() {
    const lines = [
      ["No Ticket", "Customer", "Status"],
      ...tickets.map((r) => [
        r.ticketNo,
        `${r.customer?.company || "-"} - ${r.customer?.branch || "-"} (${r.customer?.region || "-"})`,
        r.status,
      ]),
      [],
      ["Pusat", "Cabang", "Daerah", "SID", "ISP"],
      ...customers.map((r) => [r.company, r.branch || "-", r.region || "-", r.sid || "-", r.isp || "-"]),
    ]
    const csv = lines.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "report-mosaik.csv"
    a.click()
    URL.revokeObjectURL(url)
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
            <Button variant="secondary" onClick={exportCSV}>
              Export Excel (CSV)
            </Button>
            <Button onClick={exportPDF}>Export PDF</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="font-semibold mb-2">Tickets ({tickets.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-3 py-2 text-left">No Ticket</th>
                    <th className="px-3 py-2 text-left">Customer</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2">{r.ticketNo}</td>
                      <td className="px-3 py-2">
                        {r.customer?.company} - {r.customer?.branch} ({r.customer?.region})
                      </td>
                      <td className="px-3 py-2">{r.status}</td>
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
                <thead className="bg-muted/40">
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
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2">{r.company}</td>
                      <td className="px-3 py-2">{r.branch || "-"}</td>
                      <td className="px-3 py-2">{r.region || "-"}</td>
                      <td className="px-3 py-2">{r.sid || "-"}</td>
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
