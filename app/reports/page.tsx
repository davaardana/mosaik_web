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
    try {
      const html2pdf = (await import("html2pdf.js")).default

      const element = document.createElement("div")
      element.innerHTML = `
        <h2 style="font-size: 18px; margin-bottom: 10px;">Laporan Tickets</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #036fa1; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">No Ticket</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Customer</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tickets
              .map(
                (r) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${r.ticketNo}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${r.customer?.company || "-"} - ${r.customer?.branch || "-"} (${r.customer?.region || "-"})</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${r.status}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <h2 style="font-size: 18px; margin-bottom: 10px;">Laporan Customers</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #036fa1; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Pusat</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cabang</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Daerah</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">SID</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">ISP</th>
            </tr>
          </thead>
          <tbody>
            ${customers
              .map(
                (r) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${r.company}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${r.branch || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${r.region || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${r.sid || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${r.isp || "-"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `

      const opt = {
        margin: 10,
        filename: "report-mosaik.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      }

      html2pdf().set(opt).from(element).save()
    } catch (e) {
      console.error("[v0] PDF export failed:", e)
      alert("PDF export gagal. Gunakan CSV export sebagai alternatif.")
    }
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
