"use client"

import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { BackButton } from "@/components/back-button"
import Link from "next/link"

type Activity = { id: string; time: string; action: string; detail?: string }
type Device = { id: string; name: string; ip?: string; lastSeen: string }

export default function AccountSecurityPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [activities, setActivities] = useState<Activity[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // stub sample data
    setActivities([
      { id: "1", time: new Date().toLocaleString(), action: "LOGIN", detail: "Berhasil masuk" },
      { id: "2", time: new Date().toLocaleString(), action: "EDIT", detail: "Update tiket" },
      { id: "3", time: new Date().toLocaleString(), action: "LOGOUT", detail: "Keluar" },
    ])
    setDevices([
      { id: "d1", name: "Chrome on Windows", ip: "192.168.1.20", lastSeen: new Date().toLocaleString() },
      { id: "d2", name: "Safari on iPhone", ip: "192.168.1.30", lastSeen: new Date().toLocaleString() },
    ])
  }, [])

  return (
    <main className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-xl font-semibold">Akun & Keamanan</h1>
        </div>
        <span className="text-sm rounded-md border px-2 py-1">Role Anda: {user?.role || "MANAGER"}</span>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border p-4 space-y-2">
          <h2 className="font-medium">Informasi Akun</h2>
          <div className="text-sm">Nama: {user?.name || "Guest"}</div>
          <div className="text-sm">Email: {user?.email || "-"}</div>
          <div className="text-sm">Role: {user?.role || "MANAGER"}</div>
          <Button asChild className="mt-4">
            <Link href="/account/change-password">Ubah Sandi</Link>
          </Button>
        </div>

        <div className="rounded-md border p-4 space-y-2">
          <h2 className="font-medium">Aktivitas</h2>
          <div className="max-h-64 overflow-auto">
            <ul className="text-sm space-y-1">
              {activities.map((a) => (
                <li key={a.id} className="flex justify-between gap-2 border-b py-1">
                  <span>{a.action}</span>
                  <span className="text-muted-foreground">{a.detail}</span>
                  <span className="font-mono">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-md border p-4 space-y-2 md:col-span-2">
          <h2 className="font-medium">Perangkat</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-3 py-2 text-left">Perangkat</th>
                  <th className="px-3 py-2 text-left">IP</th>
                  <th className="px-3 py-2 text-left">Terakhir Dilihat</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="px-3 py-2">{d.name}</td>
                    <td className="px-3 py-2">{d.ip}</td>
                    <td className="px-3 py-2">{d.lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
