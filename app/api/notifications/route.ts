import { NextResponse } from "next/server"

const g = globalThis as any
if (!g.__NOTIFICATIONS__) {
  g.__NOTIFICATIONS__ = [
    {
      id: "n-1",
      message: "Ticket MIS-20250116-Notiket(000001) dibuat oleh Manager",
      type: "info",
      createdAt: new Date().toISOString(),
      read: false,
    },
  ]
}

export async function GET() {
  return NextResponse.json({ items: g.__NOTIFICATIONS__ })
}
