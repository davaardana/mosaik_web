export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../_db"

export async function POST(req: NextRequest) {
  const { email, oldPassword, newPassword } = await req.json()

  const user = db.users.find((u) => u.email === email)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  // In production, use bcrypt to hash and compare passwords
  // For demo, we store plain text (NOT SECURE - for development only)
  const storedPassword = (user as any).password || ""
  if (storedPassword !== oldPassword) {
    return NextResponse.json({ error: "Password lama tidak sesuai" }, { status: 401 })
  }
  // Update password
  ;(user as any).password = newPassword
  return NextResponse.json({ ok: true, message: "Password berhasil diubah" })
}
