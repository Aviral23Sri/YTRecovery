import { createHmac, timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Must run in the Node.js runtime to access the `crypto` module
 * and to read the raw request body correctly.
 */
export const runtime = 'nodejs'

export async function POST(request: Request) {
  /* ── 1. Read RAW body (must happen before any parsing) ─────── */
  const rawBody  = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''

  /* ── 2. Verify HMAC-SHA256 signature ────────────────────────── */
  const secret   = process.env.RAZORPAY_WEBHOOK_SECRET!
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')

  // Use timingSafeEqual to prevent timing attacks
  try {
    const a = Buffer.from(expected)
    const b = Buffer.from(signature)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      console.warn('[webhook] Invalid signature received.')
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 3. Parse event ─────────────────────────────────────────── */
  let event: { event: string; payload: { payment: { entity: Record<string, unknown> } } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Only act on payment.captured (money is confirmed collected)
  if (event.event !== 'payment.captured') {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 4. Extract payment data ────────────────────────────────── */
  const payment    = event.payload?.payment?.entity ?? {}
  const paymentId  = payment.id as string
  const notes      = (payment.notes ?? {}) as Record<string, string>
  const userId     = notes.user_id
  const courseId   = notes.course_id
  const amountPaid = typeof payment.amount === 'number' ? payment.amount / 100 : 0

  if (!userId || !courseId || !paymentId) {
    console.error('[webhook] Missing required fields in payment notes:', { userId, courseId, paymentId })
    return new Response(JSON.stringify({ error: 'Missing payment metadata' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 5. Idempotency — skip if already recorded ──────────────── */
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('purchases')
    .select('id')
    .eq('razorpay_payment_id', paymentId)
    .maybeSingle()

  if (existing) {
    console.log('[webhook] Payment already recorded, skipping:', paymentId)
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 6. Insert purchase via SERVICE ROLE (bypasses RLS) ─────── */
  const { error: insertErr } = await admin.from('purchases').insert({
    user_id:             userId,
    course_id:           courseId,
    razorpay_payment_id: paymentId,
    amount_paid:         amountPaid,
    status:              'success',
  })

  if (insertErr) {
    console.error('[webhook] Failed to insert purchase:', insertErr)
    return new Response(JSON.stringify({ error: 'DB insert failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log('[webhook] Purchase recorded successfully:', { userId, courseId, paymentId })
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
