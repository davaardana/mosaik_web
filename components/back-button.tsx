"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()
  return (
    <button
      type="button"
      aria-label="Kembali"
      onClick={() => router.back()}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)]"
    >
      <ArrowLeft size={18} />
    </button>
  )
}
