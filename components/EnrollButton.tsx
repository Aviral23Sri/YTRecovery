'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './EnrollButton.module.css'

/* ── Razorpay browser SDK types ─────────────────────────────── */
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

/* ── Component ───────────────────────────────────────────────── */
interface EnrollButtonProps {
  courseId: string
  price: number
  courseName: string
  /** If user is already logged-in, optionally pass their email for prefill */
  userEmail?: string
}

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

export default function EnrollButton({
  courseId,
  price,
  courseName,
  userEmail,
}: EnrollButtonProps) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleEnroll = async () => {
    setLoading(true)
    setError(null)

    try {
      /* 1 — load the Razorpay browser SDK */
      const sdkLoaded = await loadRazorpayScript()
      if (!sdkLoaded) throw new Error('Failed to load payment system. Please refresh and try again.')

      /* 2 — create a Razorpay order server-side */
      const res = await fetch('/api/razorpay/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ courseId }),
      })

      if (res.status === 401) {
        /* Not logged in — send to login then back to this page */
        router.push(`/auth/login?next=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      if (res.status === 409) {
        /* Already purchased */
        router.push('/dashboard')
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? 'Could not create order. Please try again.')
      }

      const { order_id, amount, currency } = await res.json()

      /* 3 — open Razorpay checkout modal */
      const rzp = new window.Razorpay({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount,
        currency,
        name:        'Akash Youtuber',
        description: courseName,
        order_id,
        prefill:     { email: userEmail },
        theme:       { color: '#E8A23D' },
        modal:       { ondismiss: () => setLoading(false), escape: false },
        handler: async (response) => {
          /* Payment captured by Razorpay.
           *
           * We call /api/razorpay/verify-payment which:
           *  1. Verifies the HMAC-SHA256 signature server-side (cannot be spoofed)
           *  2. Inserts the purchase row if the webhook hasn't already done so
           *
           * This is a reliable fallback — the webhook is the primary path but
           * ngrok tunnels can occasionally miss events.
           */
          try {
            await fetch('/api/razorpay/verify-payment', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                courseId,
              }),
            })
          } catch {
            // Even if this fails, the webhook may have already recorded it.
            // We still navigate to success so the user isn't stranded.
            console.warn('[enroll] verify-payment call failed; relying on webhook')
          }
          router.push(`/checkout/success?payment_id=${response.razorpay_payment_id}`)
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
        id="course-enroll-cta"
        onClick={handleEnroll}
        disabled={loading}
        className={`btn btn--primary ${styles.enrollBtn}`}
      >
        {loading
          ? <><span className={styles.spinner} aria-hidden="true" /> Processing…</>
          : `Enroll Now — ₹${price.toLocaleString('en-IN')}`}
      </button>
    </div>
  )
}
