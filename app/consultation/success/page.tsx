import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Call Booked — YTRecovery',
  description: 'Your 1:1 consultation with Akash is confirmed.',
}

interface Props {
  searchParams: Promise<{ payment_id?: string }>
}

export default async function ConsultationSuccessPage({ searchParams }: Props) {
  const { payment_id } = await searchParams

  if (!payment_id) {
    return (
      <PageShell>
        <ErrorIcon />
        <h1>Something went wrong</h1>
        <p>No payment reference found. If you were charged, please contact us immediately.</p>
        <ContactLinks />
      </PageShell>
    )
  }

  return (
    <PageShell>
      {/* Success icon */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(232,162,61,0.10)',
        border: '1px solid rgba(232,162,61,0.30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <span className="badge badge--accent">Payment Confirmed</span>

      <h1 style={{ marginBottom: 'var(--space-2)' }}>Your call is booked!</h1>

      <p style={{
        color: 'var(--color-secondary)',
        maxWidth: 480,
        textAlign: 'center',
        lineHeight: 1.7,
        fontSize: '1.05rem',
      }}>
        Payment received. Now reach out to Akash directly to schedule a time that works for you.
        He typically responds within a few hours.
      </p>

      {/* Contact cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        width: '100%',
        maxWidth: 420,
        marginTop: 'var(--space-3)',
      }}>
        {/* WhatsApp */}
        <a
          href="https://wa.me/919506606823?text=Hi%20Akash%2C%20I%20just%20booked%20a%201%3A1%20consultation%20call."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-2)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            textDecoration: 'none',
            transition: 'border-color 0.2s',
          }}
          id="consult-whatsapp-link"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="rgba(232,162,61,0.12)"/>
            <path d="M16.75 14.64c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41-.14 0-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" fill="var(--color-accent)"/>
          </svg>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>
              WhatsApp
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
              +91 95066 06823
            </p>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--color-muted)', fontSize: '0.8rem' }}>→</span>
        </a>

        {/* Email */}
        <a
          href="mailto:akashyoutubehelp@gmail.com?subject=1:1 Consultation Call Booking"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-2)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            textDecoration: 'none',
            transition: 'border-color 0.2s',
          }}
          id="consult-email-link"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="rgba(232,162,61,0.12)" stroke="var(--color-accent)" strokeWidth="1.5"/>
            <path d="M2 8l10 6 10-6" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>
              Email
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
              akashyoutubehelp@gmail.com
            </p>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--color-muted)', fontSize: '0.8rem' }}>→</span>
        </a>
      </div>

      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        color: 'var(--color-muted)',
        marginTop: 'var(--space-2)',
        letterSpacing: '0.05em',
      }}>
        Ref: {payment_id}
      </p>

      <Link href="/" className="btn btn--ghost" style={{ marginTop: 'var(--space-3)' }}>
        ← Back to home
      </Link>
    </PageShell>
  )
}

/* ── Helpers ────────────────────────────────────────────────────── */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - var(--nav-height))',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-7) var(--space-5)',
      gap: 'var(--space-4)',
      textAlign: 'center',
    }}>
      {children}
    </div>
  )
}

function ContactLinks() {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-3)' }}>
      <a href="https://wa.me/919506606823" target="_blank" rel="noopener noreferrer" className="btn btn--outline">
        WhatsApp Akash
      </a>
      <a href="mailto:akashyoutubehelp@gmail.com" className="btn btn--ghost">
        Send Email
      </a>
    </div>
  )
}

function ErrorIcon() {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'rgba(231,76,60,0.08)',
      border: '1px solid rgba(231,76,60,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#e74c3c" strokeWidth="1.8"/>
        <path d="M12 8v5M12 16h.01" stroke="#e74c3c" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </div>
  )
}
