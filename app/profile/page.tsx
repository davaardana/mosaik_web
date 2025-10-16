"use client"
import AppShell from "@/components/app-shell"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, setUser, can } = useAuth()
  const readOnly = !can("edit")

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1">
            <Label>Nama</Label>
            <Input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} readOnly={readOnly} />
          </div>
          <div className="grid gap-1">
            <Label>Role</Label>
            <Input value={user.role} readOnly />
          </div>
          <div className="flex justify-end">
            <Button disabled={readOnly}>Simpan</Button>
          </div>
          <p className="text-xs text-muted-foreground">“Om rey” tidak dapat melakukan edit sesuai ketentuan.</p>
        </CardContent>
      </Card>
    </AppShell>
  )
}
