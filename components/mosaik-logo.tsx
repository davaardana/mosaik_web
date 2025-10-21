import Image from "next/image"

export function MosaikLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Image
        src="/images/logomosaik.png"
        alt="Logo Mosaik"
        width={size * 2}
        height={size * 2}
        priority
        className="h-auto w-auto"
      />
      <div className="text-center">
        <h1 className="text-lg font-bold text-blue-600">MOSAIK</h1>
        <p className="text-xs text-gray-500">Ticketing System</p>
      </div>
    </div>
  )
}
