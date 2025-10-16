export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { db } from "../_db"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").toLowerCase()
  const sidQ = (url.searchParams.get("sid") || "").toLowerCase()

  const items = db.customers.filter((c) => {
    const hay = [c.company, c.branch, c.region, c.sid, c.isp].filter(Boolean).join(" ").toLowerCase()
    if (sidQ) return (c.sid || "").toLowerCase().includes(sidQ)
    return !q || hay.includes(q)
  })
  const res = NextResponse.json({ items })
  res.headers.set("Cache-Control", "no-store")
  return res
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const id = "cust-" + Math.random().toString(36).slice(2)
  db.customers.push({ id, ...body })
  const res = NextResponse.json({ ok: true, id })
  res.headers.set("Cache-Control", "no-store")
  return res
}
