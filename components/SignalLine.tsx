'use client'

import { useEffect, useRef } from 'react'
import styles from './SignalLine.module.css'

interface SignalLineProps {
  /** 'hero' = full animated version, 'divider' = small static echo */
  variant?: 'hero' | 'divider'
  className?: string
}

/**
 * The signature visual motif: a waveform that dips into a flagged/suspended
 * state (red), then climbs and stabilises into a recovered state (green).
 *
 * Hero variant: animated on mount via stroke-dashoffset draw-on.
 * Divider variant: small, static, faded — echoes the motif without repeating it.
 */
export default function SignalLine({ variant = 'hero', className = '' }: SignalLineProps) {
  const pathDangerRef = useRef<SVGPathElement>(null)
  const pathRecoveryRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (variant !== 'hero') return

    // Respect reduced-motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const dangerPath = pathDangerRef.current
    const recoveryPath = pathRecoveryRef.current
    if (!dangerPath || !recoveryPath) return

    const dangerLen = dangerPath.getTotalLength()
    const recoveryLen = recoveryPath.getTotalLength()

    // Start hidden
    dangerPath.style.strokeDasharray = `${dangerLen}`
    dangerPath.style.strokeDashoffset = `${dangerLen}`
    recoveryPath.style.strokeDasharray = `${recoveryLen}`
    recoveryPath.style.strokeDashoffset = `${recoveryLen}`

    // Animate danger segment first, then recovery
    const t1 = setTimeout(() => {
      dangerPath.style.transition = `stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.6, 1)`
      dangerPath.style.strokeDashoffset = '0'
    }, 300)

    const t2 = setTimeout(() => {
      recoveryPath.style.transition = `stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)`
      recoveryPath.style.strokeDashoffset = '0'
    }, 1050)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [variant])

  if (variant === 'divider') {
    return (
      <div className={`${styles.divider} ${className}`} aria-hidden="true">
        <svg viewBox="0 0 400 32" fill="none" preserveAspectRatio="none" className={styles.dividerSvg}>
          <path
            d="M0 16 L60 16 Q80 16 90 16 Q110 16 120 22 Q140 30 160 28 Q175 26 185 18 Q200 8 220 4 Q240 2 260 8 Q280 14 300 16 L400 16"
            stroke="url(#divGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="divGrad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#252C3E" />
              <stop offset="40%" stopColor="#C0392B" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#4C9A6A" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#252C3E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }

  // Hero variant — full animated signal line
  return (
    <div className={`${styles.hero} ${className}`} aria-hidden="true" role="presentation">
      <svg
        viewBox="0 0 600 200"
        fill="none"
        className={styles.svg}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glowDanger">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowSuccess">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Baseline grid lines — faint reference */}
        <line x1="0" y1="100" x2="600" y2="100" stroke="#252C3E" strokeWidth="1" strokeDasharray="4 8" />
        <line x1="0" y1="60"  x2="600" y2="60"  stroke="#1E2436" strokeWidth="1" strokeDasharray="2 12" />
        <line x1="0" y1="140" x2="600" y2="140" stroke="#1E2436" strokeWidth="1" strokeDasharray="2 12" />

        {/* Danger segment: flat → dip into suspension */}
        <path
          ref={pathDangerRef}
          d="M20 100 L80 100 Q100 100 110 102 Q130 108 150 130 Q170 155 180 165 Q190 172 200 168 Q210 164 215 158 Q225 145 235 130 Q245 115 255 100"
          stroke="#C0392B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowDanger)"
          className={styles.pathDanger}
        />

        {/* Recovery segment: climb → stabilise green */}
        <path
          ref={pathRecoveryRef}
          d="M255 100 Q265 85 280 68 Q300 46 320 38 Q335 32 350 36 Q365 40 375 48 Q390 58 400 64 Q420 72 440 70 Q460 68 480 66 Q510 64 540 65 L580 65"
          stroke="#4C9A6A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowSuccess)"
          className={styles.pathRecovery}
        />

        {/* Dot markers */}
        <circle cx="20"  cy="100" r="3" fill="#8B93A7" className={styles.dotStart} />
        <circle cx="215" cy="158" r="4" fill="#C0392B" className={styles.dotDanger} />
        <circle cx="580" cy="65"  r="4" fill="#4C9A6A" className={styles.dotSuccess} />

        {/* Labels */}
        <text x="8"   y="95"  className={styles.label} textAnchor="start">SIGNAL</text>
        <text x="198" y="185" className={styles.label} textAnchor="middle" fill="#C0392B">FLAGGED</text>
        <text x="580" y="58"  className={styles.label} textAnchor="end"   fill="#4C9A6A">RECOVERED</text>
      </svg>
    </div>
  )
}
