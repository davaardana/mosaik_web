import { NextResponse } from "next/server"

const g = globalThis as any
if (!g.__ACTIVITY_LOG__) {
  g.__ACTIVITY_LOG__ = [
    {
      id: "log-1",
      action: "CREATE_TICKET",
      user: "Manager",
      role: "MANAGER",
      timestamp: new Date().toISOString(),
      details: "Ticket MIS-20250116-Notiket(000001) dibuat",
    },
    {
      id: "log-2",
      action: "ADD_CUSTOMER",
      user: "Super Admin",
      role: "SUPER_ADMIN",
      timestamp: new Date().toISOString(),
      details: "Customer PT. Entertainment Indonesia ditambahkan",
    },
  ]
}

export async function GET() {
  return NextResponse.json({ items: g.__ACTIVITY_LOG__ })
}
