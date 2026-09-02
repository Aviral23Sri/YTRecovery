import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Check Your Email — YTRecovery',
}

export default function VerifyEmailPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - var(--nav-height))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-7) var(--space-5)',
    }}>
      <div style={{
        maxWidth: 460, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(232,162,61,0.08)',
          border: '1px solid rgba(232,162,61,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 8l9 6 9-6" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="2" y="6" width="20" height="14" rx="2" stroke="var(--color-accent)" strokeWidth="1.8"/>
          </svg>
        </div>

        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            Check Your Email
          </h1>
          <p style={{ color: 'var(--color-secondary)', lineHeight: 1.6 }}>
            We&apos;ve sent a confirmation link to your email address.
            Click it to activate your account — then come back to sign in.
          </p>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
          Didn&apos;t get it? Check your spam folder.
        </p>

        <Link href="/auth/login" className="btn btn--outline">
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
