import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Payment Confirmed — YTRecovery',
}

interface Props {
  searchParams: Promise<{ payment_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { payment_id } = await searchParams

  // ── If no payment_id param, something went wrong ──────────────
  if (!payment_id) {
    return (
      <PageShell>
        <ErrorIcon />
        <h1>Something went wrong</h1>
        <p>No payment reference found. Please contact support if you were charged.</p>
        <Link href="/courses" className="btn btn--outline">Back to Courses</Link>
      </PageShell>
    )
  }

  // ── Check if purchase is recorded (webhook may be async) ──────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let status: 'success' | 'pending' | 'notfound' = 'notfound'

  if (user) {
    const { data } = await supabase
      .from('purchases')
      .select('status')
      .eq('razorpay_payment_id', payment_id)
      .maybeSingle()

    if (data?.status === 'success') status = 'success'
    else if (data)                   status = 'pending'
  }

  // ── Success ───────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <PageShell>
        <SuccessIcon />
        <span className="badge badge--success" style={{ marginBottom: 'var(--space-2)' }}>
          Payment Confirmed
        </span>
        <h1 style={{ marginBottom: 'var(--space-3)' }}>You&apos;re enrolled!</h1>
        <p style={{ color: 'var(--color-secondary)', maxWidth: 440, textAlign: 'center', lineHeight: 1.6 }}>
          Your purchase is confirmed. Head to your dashboard to start watching the
          YouTube Monetization Recovery Master Course.
        </p>
        <Link href="/dashboard" className="btn btn--primary" style={{ marginTop: 'var(--space-4)' }}>
          Go to Dashboard →
        </Link>
      </PageShell>
    )
  }

  // ── Webhook not yet processed (common for first few seconds) ──
  return (
    <PageShell>
      <PendingIcon />
      <span className="badge badge--accent" style={{ marginBottom: 'var(--space-2)' }}>
        Processing
      </span>
      <h1 style={{ marginBottom: 'var(--space-3)' }}>Payment received</h1>
      <p style={{ color: 'var(--color-secondary)', maxWidth: 440, textAlign: 'center', lineHeight: 1.6 }}>
        Your payment is being confirmed. This usually takes a few seconds.
        Your course will appear in your dashboard shortly.
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: 'var(--space-2)' }}>
        Ref: {payment_id}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        <Link href="/dashboard" className="btn btn--primary">Check Dashboard</Link>
        <Link href="/courses"   className="btn btn--ghost">Back to Courses</Link>
      </div>
    </PageShell>
  )
}

/* ── Layout helpers ─────────────────────────────────────────────── */
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

function SuccessIcon() {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'rgba(76,154,106,0.1)',
      border: '1px solid rgba(76,154,106,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 13l4 4L19 7" stroke="var(--color-success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

function PendingIcon() {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'rgba(232,162,61,0.08)',
      border: '1px solid rgba(232,162,61,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="var(--color-accent)" strokeWidth="1.8"/>
        <path d="M12 7v5l3 3" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
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
