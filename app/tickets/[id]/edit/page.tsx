"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

type Ticket = {
  id: string
  number: string
  status: string
  createdByRole: "SUPER_ADMIN" | "MANAGER" | "NOC"
  customerCentral?: string
  customerBranch?: string
  region?: string
  sid?: string
  problem?: string
  solution?: string
}

export default function EditTicketPage() {
  const params = useParams()
  const id = String(params?.id || "")
  const router = useRouter()
  const { user } = useAuth()
  const role = (user?.role || "NOC") as "SUPER_ADMIN" | "MANAGER" | "NOC"

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const isSuperAdmin = role === "SUPER_ADMIN"
  const isManager = role === "MANAGER"
  const isNoc = role === "NOC"

  const readOnly = isManager

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`)
        if (!res.ok) throw new Error("not found")
        const data = await res.json()
        if (mounted) setTicket(data)
      } catch (e) {
        toast({ title: "Ticket tidak ditemukan", description: "Kembali ke daftar." })
        router.push("/tickets")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [id, router])

  async function onSave() {
    if (!ticket) return
    try {
      setSaving(true)
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ticket }),
      })
      if (!res.ok) throw new Error("failed to save")
      toast({ title: "Perubahan disimpan" })
    } catch (e) {
      toast({ title: "Gagal menyimpan", description: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-4">Memuat...</div>
  if (!ticket) return null

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between sticky top-0 bg-background py-2">
        <h1 className="text-xl font-semibold">Edit Ticket #{ticket.number}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Kembali
          </Button>
          {!readOnly && (
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 mt-4">
        <Input value={ticket.customerCentral || ""} readOnly placeholder="Pusat" />
        <Input value={ticket.customerBranch || ""} readOnly placeholder="Cabang" />
        <Input value={ticket.region || ""} readOnly placeholder="Daerah" />
        <Input value={ticket.sid || ""} readOnly placeholder="SID" />
        <Textarea
          value={ticket.problem || ""}
          readOnly={readOnly}
          onChange={(e) => setTicket({ ...ticket, problem: e.target.value })}
          placeholder="Problem/Masalah"
        />
        <Textarea
          value={ticket.solution || ""}
          readOnly={readOnly}
          onChange={(e) => setTicket({ ...ticket, solution: e.target.value })}
          placeholder="Tindakan yang Diambil (solusi)"
        />
      </div>
    </main>
  )
}
