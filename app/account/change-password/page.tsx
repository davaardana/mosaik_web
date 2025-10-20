"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import AppShell from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/components/auth-context"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("Semua field harus diisi")
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Password baru tidak cocok")
      return
    }

    if (form.newPassword.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Gagal mengubah password")

      setSuccess("Password berhasil diubah")
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => router.push("/account"), 2000)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="sticky top-0 z-10 -mt-4 mb-3 pt-4 bg-background">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-xl font-semibold">Ubah Sandi</h1>
        </div>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Ubah Sandi Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
            {success && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">{success}</div>}

            <div>
              <label className="block text-sm font-medium mb-1">Sandi Lama</label>
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sandi Baru</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Konfirmasi Sandi Baru</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Ubah Sandi"}
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
