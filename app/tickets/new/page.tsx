"use client"
import AppShell from "@/components/app-shell"
import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BackButton } from "@/components/back-button"
import { useRouter } from "next/navigation"

type Customer = {
  id: string
  company: string
  branch?: string
  region?: string
  sid?: string
  isp?: string
}

function generateTicketNumber() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const seq = Math.floor(Math.random() * 900 + 100) // contoh urutan
  return `T-${yyyy}${mm}${dd}-${seq}`
}

export default function NewTicketPage() {
  const { user, gate } = useAuth() // get gate from Auth
  const router = useRouter()
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("New")
  const [images, setImages] = useState<File[]>([])
  const [custList, setCustList] = useState<Customer[]>([])
  const [lokasi, setLokasi] = useState("")
  const [problem, setProblem] = useState("")
  const [solusi, setSolusi] = useState("")
  const [selected, setSelected] = useState<Customer | null>(null)
  const noTicket = useMemo(() => generateTicketNumber(), [])

  const role = (user.role || "").toUpperCase() as "SUPER_ADMIN" | "MANAGER" | "NOC"
  const gateOpen = gate.isOpen // use actual gate state
  const readOnly = role === "NOC" ? !gateOpen : false

  useEffect(() => {
    let active = true
    const run = async () => {
      const qs = q ? `?q=${encodeURIComponent(q)}` : ""
      const res = await fetch(`/api/customers${qs}`)
      const data = await res.json()
      if (!active) return
      setCustList((data?.items as Customer[]) || [])
    }
    run()
    return () => {
      active = false
    }
  }, [q])

  const filtered = custList

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const next = [...images, ...files].slice(0, 5)
    setImages(next)
  }

  async function saveTicket() {
    if (role === "NOC" && !gateOpen) return
    const statusApi = status === "New" ? "OPEN" : status === "In Progress" ? "IN_PROGRESS" : "CLOSED" // Resolved/Closed -> CLOSED
    const payload = {
      ticketNo: noTicket,
      customerId: selected?.id || "",
      customer: selected
        ? {
            company: selected.company,
            branch: selected.branch || "",
            region: selected.region || "",
            sid: selected.sid || "",
          }
        : null,
      problem,
      location: lokasi,
      status: statusApi,
      openedBy: `${user.role}:${user.name}`,
    }
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.log("[v0] Save ticket failed:", await res.text())
      alert("Gagal menyimpan tiket")
      return
    }
    router.push("/tickets")
  }

  console.log("[v0] NewTicket role:", role, "gateOpen:", gateOpen, "readOnly:", readOnly)

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-2">
        <BackButton />
        <h1 className="text-xl font-semibold">Create New Ticket</h1>
      </div>

      <div className="mb-4">
        <Alert>
          <AlertTitle>Info Tiket</AlertTitle>
          <AlertDescription>
            {role === "NOC"
              ? gateOpen
                ? "Create Ticket telah dibuka oleh Manager/Super Admin. Anda dapat mengisi."
                : "Menunggu Manager/Super Admin membuka Create Ticket."
              : "Anda dapat mengisi form Create Ticket."}
          </AlertDescription>
        </Alert>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Form Tiket</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2 md:grid-cols-3">
            <div className="grid gap-1">
              <Label>No Tiket (Otomatis)</Label>
              <Input value={noTicket} readOnly />
            </div>

            <div className="grid gap-1 md:col-span-2">
              <Label>Nama Customer</Label>
              <Input
                placeholder="Cari: nama pusat / cabang / daerah / SID"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                readOnly={readOnly}
              />
              {q && (
                <div className="mt-2 rounded-md border max-h-56 overflow-y-auto">
                  {filtered.length === 0 && <div className="p-2 text-sm text-muted-foreground">Tidak ada hasil</div>}
                  {filtered.map((c, idx) => (
                    <button
                      key={c.id ?? idx}
                      type="button"
                      className="w-full text-left p-2 text-sm hover:bg-muted"
                      onClick={() => {
                        setSelected(c)
                        setLokasi(c.region || "")
                        setQ(
                          `${c.company} - ${c.branch ?? ""} (${c.region ?? "-"}) ${c.sid ? "• " + c.sid : ""}`.trim(),
                        )
                      }}
                      disabled={readOnly}
                    >
                      <div className="font-medium">
                        {c.company}
                        {c.branch ? ` • ${c.branch}` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {c.region ? `Daerah: ${c.region}` : "Daerah: -"} {c.sid ? `• SID: ${c.sid}` : ""}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <div className="grid gap-1 md:col-span-2">
              <Label>Problem / Masalah</Label>
              <Textarea
                placeholder="Jelaskan masalahnya"
                className="min-h-24"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                readOnly={readOnly}
              />
            </div>
            <div className="grid gap-1">
              <Label>Lokasi Trouble (nama daerah)</Label>
              <Input
                placeholder="Contoh: Jakarta"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                readOnly={readOnly}
              />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <div className="grid gap-1 md:col-span-2">
              <Label>Tindakan yang Diambil (solusi)</Label>
              <Textarea
                placeholder="Langkah atau solusi yang dilakukan"
                className="min-h-24"
                value={solusi}
                onChange={(e) => setSolusi(e.target.value)}
                readOnly={readOnly}
              />
            </div>

            <div className="grid gap-1">
              <Label>Status Ticket</Label>
              <Select value={status} onValueChange={setStatus} disabled={readOnly}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1">
            <Label>Kirim Foto (Max 5 foto - PNG, JPG)</Label>
            <Input type="file" accept="image/png,image/jpeg" multiple onChange={onFiles} disabled={readOnly} />
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((f, idx) => (
                <div key={idx} className="text-xs rounded border px-2 py-1 bg-secondary">
                  {f.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Batal
            </Button>
            <Button
              type="button"
              disabled={role === "NOC" && !gateOpen}
              onClick={saveTicket} // save to API
            >
              Simpan Ticket
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Catatan & Waktu Mulai/Berakhir/Downtime telah dihilangkan sesuai brief. Lokasi & saran tidak terintegrasi
            maps.
          </p>
          <p className="text-xs text-muted-foreground">
            Login: {user.name} • Role: {user.role}
          </p>
        </CardContent>
      </Card>
    </AppShell>
  )
}
