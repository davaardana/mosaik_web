"use client"

import AppShell from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ticketRows = [
  { number: "20251015-001", customer: "PT Alpha - Cabang A (Jakarta)", status: "OPEN" },
  { number: "20251015-002", customer: "PT Alpha - Cabang B (Bandung)", status: "RESOLVED" },
]

const customerRows = [
  { pusat: "PT Alpha", cabang: "Cabang A", daerah: "Jakarta", sid: "SID-001", isp: "Indibiz" },
  { pusat: "PT Alpha", cabang: "Cabang B", daerah: "Bandung", sid: "SID-002", isp: "Biznet" },
]

export default function ReportsPage() {
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
      body: ticketRows.map((r) => [r.number, r.customer, r.status]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [3, 105, 161] }, // teal-ish
    })

    const y = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.text("Laporan Customers", 14, y)
    ;(doc as any).autoTable({
      startY: y + 4,
      head: [["Pusat", "Cabang", "Daerah", "SID", "ISP"]],
      body: customerRows.map((r) => [r.pusat, r.cabang, r.daerah, r.sid, r.isp]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [3, 105, 161] },
    })

    doc.save("report-mosaik.pdf")
  }

  function exportCSV() {
    const lines = [
      ["No Ticket", "Customer", "Status"],
      ...ticketRows.map((r) => [r.number, r.customer, r.status]),
      [],
      ["Pusat", "Cabang", "Daerah", "SID", "ISP"],
      ...customerRows.map((r) => [r.pusat, r.cabang, r.daerah, r.sid, r.isp]),
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

  return (
    <AppShell>
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
            <h3 className="font-semibold mb-2">Tickets</h3>
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
                  {ticketRows.map((r) => (
                    <tr key={r.number} className="border-t">
                      <td className="px-3 py-2">{r.number}</td>
                      <td className="px-3 py-2">{r.customer}</td>
                      <td className="px-3 py-2">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Customers</h3>
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
                  {customerRows.map((r) => (
                    <tr key={`${r.pusat}-${r.cabang}`}>
                      <td className="px-3 py-2">{r.pusat}</td>
                      <td className="px-3 py-2">{r.cabang}</td>
                      <td className="px-3 py-2">{r.daerah}</td>
                      <td className="px-3 py-2">{r.sid}</td>
                      <td className="px-3 py-2">{r.isp}</td>
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
