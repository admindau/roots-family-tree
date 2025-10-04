"use client"
import Image from "next/image"
import { useState } from "react"

export default function Logo({ size = 84, className = "" }: { size?: number; className?: string }) {
  const [broken, setBroken] = useState(false)

  if (!broken) {
    return (
      <Image
        src="/logo.png"
        alt="Roots Logo"
        width={size}
        height={size}
        unoptimized
        onError={() => setBroken(true)}
        className={`logo-glow ${className}`}
      />
    )
  }

  // Inline SVG fallback with glow
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`logo-glow ${className}`}>
      <circle cx="50" cy="50" r="46" fill="#0b0b0b" stroke="#16a34a" strokeWidth="3"/>
      <path d="M50 18 C42 40, 58 45, 50 64 C43 79, 62 86, 65 94" stroke="#facc15" strokeWidth="3" fill="none"/>
      <path d="M50 18 C58 40, 42 45, 50 64 C57 79, 38 86, 35 94" stroke="#dc2626" strokeWidth="3" fill="none"/>
      <text x="50" y="95" fontSize="12" textAnchor="middle" fill="#fff">ROOTS</text>
    </svg>
  )
}
