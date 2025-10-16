import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { TicketGateProvider } from "@/components/ticket-gate"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mosaik Ticketing System",
  description: "PT. Mosaik Integrasi Solusindo - Ticketing",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <TicketGateProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </TicketGateProvider>
        <Analytics />
      </body>
    </html>
  )
}
