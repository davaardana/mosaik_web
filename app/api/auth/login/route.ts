import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const { email, password, role } = JSON.parse(body || "{}")
  const r = String(role || "")
    .toUpperCase()
    .replace(/\s+/g, "_")
  const mapped = r === "SUPERADMIN" ? "SUPER_ADMIN" : r
  return NextResponse.json({ user: { id: "u-" + Math.random().toString(36).slice(2), email, role: mapped } })
}
