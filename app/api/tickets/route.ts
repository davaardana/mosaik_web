import { type NextRequest, NextResponse } from "next/server"
import { db, genTicketNo } from "../_db"

export async function GET() {
  return NextResponse.json({ items: db.tickets })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const id = "t-" + Math.random().toString(36).slice(2)
  const ticketNo = body.ticketNo || genTicketNo()
  const rec: any = {
    id,
    ticketNo,
    customerId: body.customerId || null,
    customer: body.customer || null, // accept inline customer snapshot and preserve it so Tickets can render names without join
    problem: body.problem || "",
    location: body.location || "",
    status: body.status || "OPEN",
    openedBy: body.openedBy || "",
    createdAt: new Date().toISOString(),
  }
  db.tickets.push(rec)
  return NextResponse.json({ ok: true, id, ticketNo })
}
