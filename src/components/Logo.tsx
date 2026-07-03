import React from 'react'

interface LogoProps {
  size?: number
  className?: string
}

/**
 * AVERBRIDGE logo mark — a stylised "A" bridge arc with two chain-link nodes,
 * rendered in the brand violet→cyan gradient.
 */
export function LogoMark({ size = 32, className = '' }: LogoProps) {
  const id = 'avg-grad'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#38D9C9" />
        </linearGradient>
      </defs>

      {/* Outer ring — subtle background circle */}
      <circle cx="20" cy="20" r="19" stroke={`url(#${id})`} strokeWidth="1.5" opacity="0.25" />

      {/* Bridge arc — the main structural element */}
      <path
        d="M7 26 Q20 8 33 26"
        stroke={`url(#${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bridge deck — horizontal bar */}
      <line
        x1="7" y1="26" x2="33" y2="26"
        stroke={`url(#${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Left suspension cable */}
      <line
        x1="12" y1="26" x2="16" y2="18"
        stroke={`url(#${id})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Right suspension cable */}
      <line
        x1="28" y1="26" x2="24" y2="18"
        stroke={`url(#${id})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Left pier node */}
      <circle cx="7" cy="26" r="2.5" fill={`url(#${id})`} />

      {/* Right pier node */}
      <circle cx="33" cy="26" r="2.5" fill={`url(#${id})`} />

      {/* Apex node — top of the arch */}
      <circle cx="20" cy="11" r="2.5" fill={`url(#${id})`} />

      {/* Inner glow dot at apex */}
      <circle cx="20" cy="11" r="1" fill="white" opacity="0.6" />
    </svg>
  )
}

export function LogoFull({ height = 28, className = '' }: { height?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <LogoMark size={height} />
      <span
        style={{ fontSize: height * 0.64, lineHeight: 1 }}
        className="font-bold tracking-tight bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent"
      >
        AVERBRIDGE
      </span>
    </span>
  )
}
