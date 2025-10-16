import { NextResponse } from "next/server"
import { db } from "../../_db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const t = db.tickets.find((x) => x.id === params.id)
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(t)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const idx = db.tickets.findIndex((x) => x.id === params.id)
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const body = await req.json()
  db.tickets[idx] = { ...db.tickets[idx], ...body, updatedAt: new Date().toISOString() }
  return NextResponse.json(db.tickets[idx])
}
