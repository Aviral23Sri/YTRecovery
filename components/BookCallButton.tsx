'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './BookCallButton.module.css'

/* ── Razorpay browser SDK types ─────────────────────────────────── */
declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance
    }
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayHandlerResponse) => void
  prefill?: { email?: string; name?: string; contact?: string }
  theme?: { color?: string }
  modal?: { ondismiss?: () => void; escape?: boolean }
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  on: (event: string, cb: (data: unknown) => void) => void
  open: () => void
}

/* ── Load Razorpay SDK lazily ────────────────────────────────────── */
function loadRazorpayScript(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src   = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

/* ── Component ───────────────────────────────────────────────────── */
export default function BookCallButton() {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleBookCall = async () => {
    setLoading(true)
    setError(null)

    try {
      /* 1 — load Razorpay SDK */
      const sdkLoaded = await loadRazorpayScript()
      if (!sdkLoaded) throw new Error('Could not load payment system. Please refresh and try again.')

      /* 2 — create order server-side (price decided on server — ₹999) */
      const res = await fetch('/api/razorpay/create-consultation-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}), // guest info collected by Razorpay modal itself
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? 'Could not create order. Please try again.')
      }

      const { order_id, amount, currency, prefill } = await res.json()

      /* 3 — open Razorpay checkout modal */
      const rzp = new window.Razorpay({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount,
        currency,
        name:        'Akash Kanojiya',
        description: '1:1 YouTube Consultation Call',
        order_id,
        prefill: {
          name:    prefill?.name    ?? '',
          email:   prefill?.email   ?? '',
          contact: prefill?.contact ?? '',
        },
        theme: { color: '#E8A23D' },
        modal: { ondismiss: () => setLoading(false), escape: false },

        handler: async (response) => {
          /* Payment captured — call verify-consultation as reliable fallback */
          try {
            await fetch('/api/razorpay/verify-consultation', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                // prefill values captured at order-creation time
                name:    prefill?.name    ?? '',
                email:   prefill?.email   ?? '',
                phone:   prefill?.contact ?? '',
              }),
            })
          } catch {
            console.warn('[book-call] verify-consultation call failed; relying on webhook')
          }
          router.push(`/consultation/success?payment_id=${response.razorpay_payment_id}`)
        },
      })

      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.')
        setLoading(false)
      })

      rzp.open()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      {error && (
        <p className={styles.error} role="alert">{error}</p>
      )}
      <button
        id="book-call-cta"
        onClick={handleBookCall}
        disabled={loading}
        className={`btn btn--primary ${styles.bookBtn}`}
      >
        {loading
          ? <><span className={styles.spinner} aria-hidden="true" /> Processing…</>
          : 'Book a Call — ₹999'}
      </button>
    </div>
  )
}
