"use client"
import AppShell from "@/components/app-shell"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SecurityPage() {
  const { user, setUser } = useAuth()

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1">
            <Label>Atur Role</Label>
            <Select value={user.role} onValueChange={(v) => setUser({ ...user, role: v as any })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
                <SelectItem value="MANAGER">MANAGER</SelectItem>
                <SelectItem value="STAFF">STAFF</SelectItem>
                <SelectItem value="NOC">NOC</SelectItem>
                <SelectItem value="TEKNISI">TEKNISI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Hak akses: NOC/Teknisi tidak dapat mengakses menu Tickets dan tombol Create Ticket dinonaktifkan.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  )
}
