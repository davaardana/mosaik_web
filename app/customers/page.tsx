"use client"
import { useMemo } from "react"
import useSWR from "swr"
import AppShell from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/components/auth-context"

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())

export default function CustomersPage() {
  const { user } = useAuth()
  const { data } = useSWR("/api/customers?q=", fetcher)
  const rows = useMemo(() => (data?.items as any[]) || [], [data])
  const canEdit = user?.role === "MANAGER" || user?.role === "SUPER_ADMIN"

  return (
    <AppShell>
      <div className="sticky top-0 z-10 -mt-4 mb-3 pt-4 bg-background">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-xl font-semibold">Customer</h1>
          </div>
          <Button asChild>
            <Link href="/customers/new">Add Customer</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Customer</TableHead>
                <TableHead>Phone/WA</TableHead>
                <TableHead>SID</TableHead>
                <TableHead>ISP</TableHead>
                <TableHead>Bandwidth</TableHead>
                {canEdit && <TableHead>Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c: any) => {
                const phone = c.phone || c.telpPic || c.callCenter || "-"
                const name =
                  `${c.company || c.pusat || ""}` +
                  `${c.branch || c.cabang ? ` - ${c.branch || c.cabang}` : ""}` +
                  `${c.region || c.daerah ? ` (${c.region || c.daerah})` : ""}`
                return (
                  <TableRow key={c.id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{phone}</TableCell>
                    <TableCell>{c.sid || "-"}</TableCell>
                    <TableCell>{c.isp || "-"}</TableCell>
                    <TableCell>{c.bandwidth || "-"}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/customers/${c.id}/edit`}>Edit</Link>
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  )
}
