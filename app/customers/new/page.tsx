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
  const [sid, setSid] = useState("")

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
            <Label>Customer Name</Label>
            <Input placeholder="Cari pusat, tampilkan cabang & daerah atau berdasarkan SID" />
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-1">
              <Label>Phone/Whatsapp</Label>
              <Input placeholder="08xxx / +62xxx" />
            </div>
            <div className="grid gap-1">
              <Label>Alamat (tanpa maps)</Label>
              <Textarea placeholder="Alamat lengkap" className="min-h-24" />
            </div>
          </div>

          <div className="grid gap-1">
            <Label>SID</Label>
            <Input placeholder="Contoh: 1524317xxxxx / S00xxxx" value={sid} onChange={(e) => setSid(e.target.value)} />
          </div>

          <p className="text-xs text-muted-foreground">Email tidak wajib diisi dan dihilangkan sesuai brief.</p>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Batal
            </Button>
            <Button
              type="button"
              onClick={async () => {
                try {
                  const raw = localStorage.getItem("mosaik:customers")
                  const arr = raw ? JSON.parse(raw) : []
                  const nameInput =
                    document.querySelector<HTMLInputElement>("input[placeholder^='Cari pusat']")?.value || ""
                  const phone =
                    document.querySelector<HTMLInputElement>("input[placeholder='08xxx / +62xxx']")?.value || ""
                  const address =
                    document.querySelector<HTMLTextAreaElement>("textarea[placeholder='Alamat lengkap']")?.value || ""

                  const m = nameInput.match(/^(.*?)\s*(?:-\s*(.*?))?\s*(?:$$(.*?)$$)?\s*$/)
                  const pusat = (m?.[1] || nameInput).trim()
                  const cabang = (m?.[2] || "").trim()
                  const daerah = (m?.[3] || "").trim()

                  const rec = { pusat, cabang, daerah, sid, phone, address }
                  arr.push(rec)
                  localStorage.setItem("mosaik:customers", JSON.stringify(arr))

                  await fetch("/api/customers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      company: pusat,
                      branch: cabang,
                      region: daerah,
                      sid,
                      telpPic: phone,
                    }),
                  })
                  alert("Customer disimpan")
                  router.back()
                } catch (e) {
                  alert("Gagal menyimpan customer")
                }
              }}
            >
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
