import Image from "next/image"

export function MosaikLogo({ size = 28 }: { size?: number }) {
  return (
    <Image src="/images/logomosaik.png" alt="Logo PT. Mosaik Integrasi Solusindo" width={size} height={size} priority />
  )
}
