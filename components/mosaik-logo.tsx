import Image from "next/image"

export function MosaikLogo({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/images/logomosaik.png"
      alt="Logo PT. Mosaik Integrasi Solusindo"
      width={size}
      height={size}
      priority
      className="dark:invert-0 invert"
      style={{
        filter: "drop-shadow(0 0 0 transparent)",
        mixBlendMode: "screen",
        backgroundColor: "transparent",
      }}
    />
  )
}
