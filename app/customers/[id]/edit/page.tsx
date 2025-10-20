"use client"
import { useState } from "react"
import type React from "react"

import { useRouter, useParams } from "next/navigation"
import useSWR from "swr"
import AppShell from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/components/auth-context"

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const customerId = params.id as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { data: customer } = useSWR(`/api/customers/${customerId}`, fetcher)

  const [form, setForm] = useState({
    company: customer?.company || "",
    branch: customer?.branch || "",
    region: customer?.region || "",
    sid: customer?.sid || "",
    isp: customer?.isp || "",
    telpPic: customer?.telpPic || "",
    callCenter: customer?.callCenter || "",
    bandwidth: customer?.bandwidth || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Gagal update customer")
      router.push("/customers")
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== "MANAGER" && user?.role !== "SUPER_ADMIN") {
    return (
      <AppShell>
        <div className="text-center py-8">
          <p className="text-red-500">Anda tidak memiliki akses untuk mengedit customer.</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="sticky top-0 z-10 -mt-4 mb-3 pt-4 bg-background">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-xl font-semibold">Edit Customer</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Data Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium mb-1">Perusahaan</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cabang</label>
              <input
                type="text"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Daerah</label>
              <input
                type="text"
                name="region"
                value={form.region}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SID</label>
              <input
                type="text"
                name="sid"
                value={form.sid}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ISP</label>
              <input
                type="text"
                name="isp"
                value={form.isp}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telepon PIC</label>
              <input
                type="text"
                name="telpPic"
                value={form.telpPic}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Call Center</label>
              <input
                type="text"
                name="callCenter"
                value={form.callCenter}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bandwidth</label>
              <input
                type="text"
                name="bandwidth"
                value={form.bandwidth}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  )
}
