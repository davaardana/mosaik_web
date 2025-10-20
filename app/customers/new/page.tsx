"use client"
import AppShell from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { useRouter } from "next/navigation"

export default function AddCustomerPage() {
  const router = useRouter()
  const [company, setCompany] = useState("")
  const [branch, setBranch] = useState("")
  const [region, setRegion] = useState("")
  const [sid, setSid] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [isp, setIsp] = useState("")

  async function saveCustomer() {
    try {
      const payload = {
        company,
        branch,
        region,
        sid,
        telpPic: phone,
        isp,
      }
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        alert("Gagal menyimpan customer")
        return
      }
      alert("Customer disimpan")
      router.back()
    } catch (e) {
      console.error("[v0] Failed to save customer:", e)
      alert("Gagal menyimpan customer")
    }
  }

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-2">
        <BackButton />
        <h1 className="text-xl font-semibold">Add Customer</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Form Customer Baru</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1">
            <Label>Nama Perusahaan (Pusat)</Label>
            <Input
              placeholder="Contoh: PT. Entertainment Indonesia"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-1">
              <Label>Cabang</Label>
              <Input
                placeholder="Contoh: Celebrity Fitness Tunjungan Plaza 5"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label>Daerah</Label>
              <Input placeholder="Contoh: Surabaya" value={region} onChange={(e) => setRegion(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-1">
              <Label>SID</Label>
              <Input placeholder="Contoh: 152413175556" value={sid} onChange={(e) => setSid(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>ISP</Label>
              <Input placeholder="Contoh: Telkom Indibiz" value={isp} onChange={(e) => setIsp(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-1">
              <Label>Phone/Whatsapp</Label>
              <Input placeholder="08xxx / +62xxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Alamat</Label>
              <Textarea
                placeholder="Alamat lengkap"
                className="min-h-20"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Semua akun (SUPER_ADMIN, MANAGER, NOC) dapat menambah customer baru.
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="button" onClick={saveCustomer}>
              Simpan Customer
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
