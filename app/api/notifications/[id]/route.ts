import { NextResponse } from "next/server"

const g = globalThis as any

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const notif = g.__NOTIFICATIONS__?.find((n: any) => n.id === id)
  if (notif) {
    notif.read = true
  }
  return NextResponse.json({ ok: true })
}
