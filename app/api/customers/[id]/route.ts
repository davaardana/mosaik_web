export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../_db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const customer = db.customers.find((c) => c.id === params.id)
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(customer)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const idx = db.customers.findIndex((c) => c.id === params.id)
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })

  db.customers[idx] = { ...db.customers[idx], ...body }
  return NextResponse.json({ ok: true })
}
