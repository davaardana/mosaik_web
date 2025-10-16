"use client"
import AppShell from "@/components/app-shell"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BackButton } from "@/components/back-button"

export default function TicketsPage() {
  const { user, gate } = useAuth()
  const router = useRouter()
  const role = (user.role || "").toUpperCase()
  const [tickets, setTickets] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const [t, c] = await Promise.all([fetch("/api/tickets"), fetch("/api/customers?q=")])
        const tj = await t.json()
        const cj = await c.json()
        setTickets(tj.items || [])
        setCustomers(cj.items || [])
      } catch {}
    })()
  }, [])

  const hasGate = gate.isOpen
  const disabled = role === "NOC" && !hasGate

  function createOrFill() {
    if (role === "SUPER_ADMIN" || role === "MANAGER") {
      gate.open({ name: user.name, role: user.role as any })
      router.push("/tickets/new")
    } else if (hasGate) {
      router.push("/tickets/new")
    }
  }

  function renderCustomer(t: any) {
    if (t.customer) {
      const c = t.customer
      return `${c.pusat || ""}${c.cabang ? " - " + c.cabang : ""}${c.daerah ? " (" + c.daerah + ")" : ""}${
        c.sid ? " • " + c.sid : ""
      }`
    }
    if (t.customerId) {
      const c = customers.find((x) => x.id === t.customerId)
      if (c)
        return `${c.company || c.pusat || ""}${c.branch || c.cabang ? " - " + (c.branch || c.cabang) : ""}${
          c.region || c.daerah ? " (" + (c.region || c.daerah) + ")" : ""
        }${c.sid ? " • " + c.sid : ""}`
    }
    return "-"
  }

  const canEdit = (t: any) => role === "SUPER_ADMIN" || role === "NOC"
  const goEdit = (t: any) => {
    if (!canEdit(t)) return
    router.push(`/tickets/${t.id}/edit`)
  }

  return (
    <AppShell>
      <div className="sticky top-0 z-10 -mt-4 mb-4 pt-4 bg-background">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-xl font-semibold text-balance">Tickets</h1>
          </div>
          <Button onClick={createOrFill} disabled={disabled}>
            {role === "NOC" ? (disabled ? "Menunggu Manager/SuperAdmin" : "Isi Ticket") : "Create Ticket"}
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Ticket</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((t) => (
            <TableRow key={t.id} className={canEdit(t) ? "cursor-pointer" : ""} onClick={() => goEdit(t)}>
              <TableCell>{t.ticketNo || t.number}</TableCell>
              <TableCell>{renderCustomer(t)}</TableCell>
              <TableCell>{t.status || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppShell>
  )
}
