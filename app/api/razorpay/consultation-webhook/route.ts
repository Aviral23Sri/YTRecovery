import { createHmac, timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/razorpay/consultation-webhook
 *
 * Razorpay fires this when a consultation payment is captured.
 * Verified with HMAC-SHA256 before any DB writes.
 * Uses the same RAZORPAY_WEBHOOK_SECRET as the course webhook.
 */
export const runtime = 'nodejs'

export async function POST(request: Request) {
  /* ── 1. Read raw body before any parsing ─────────────────────── */
  const rawBody   = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''

  /* ── 2. Verify HMAC-SHA256 signature ─────────────────────────── */
  const secret   = process.env.RAZORPAY_WEBHOOK_SECRET!
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')

  try {
    const a = Buffer.from(expected)
    const b = Buffer.from(signature)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      console.warn('[consultation-webhook] Invalid signature.')
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 3. Parse event ───────────────────────────────────────────── */
  let event: { event: string; payload: { payment: { entity: Record<string, unknown> } } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  // Only act on payment.captured
  if (event.event !== 'payment.captured') {
    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 4. Extract payment data ──────────────────────────────────── */
  const payment    = event.payload?.payment?.entity ?? {}
  const paymentId  = payment.id as string
  const notes      = (payment.notes ?? {}) as Record<string, string>
  const amountPaid = typeof payment.amount === 'number' ? payment.amount / 100 : 0

  // Only process consultation payments
  if (notes.type !== 'consultation') {
    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!paymentId) {
    console.error('[consultation-webhook] Missing payment ID')
    return new Response(JSON.stringify({ error: 'Missing payment ID' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 5. Idempotency check ─────────────────────────────────────── */
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('consultations')
    .select('id')
    .eq('razorpay_payment_id', paymentId)
    .maybeSingle()

  if (existing) {
    console.log('[consultation-webhook] Already recorded, skipping:', paymentId)
    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 6. Insert into consultations table ───────────────────────── */
  const { error: insertErr } = await admin.from('consultations').insert({
    guest_name:          notes.guest_name  || null,
    guest_email:         notes.guest_email || null,
    guest_phone:         notes.guest_phone || null,
    razorpay_order_id:   (payment.order_id as string) || null,
    razorpay_payment_id: paymentId,
    amount_paid:         amountPaid,
    status:              'success',
  })

  if (insertErr) {
    console.error('[consultation-webhook] DB insert failed:', insertErr)
    return new Response(JSON.stringify({ error: 'DB insert failed' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log('[consultation-webhook] Consultation recorded:', paymentId)
  return new Response(JSON.stringify({ received: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  })
}
