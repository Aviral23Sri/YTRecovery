import { createHmac, timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/razorpay/webhook
 *
 * Single webhook for all Razorpay payment events.
 * Uses notes.type to branch between:
 *   - 'consultation' → inserts into the consultations table
 *   - anything else  → treated as a course purchase (inserts into purchases table)
 *
 * Register this one URL in Razorpay Dashboard for all events.
 */
export const runtime = 'nodejs'

export async function POST(request: Request) {
  /* ── 1. Read raw body (must happen before any parsing) ─────── */
  const rawBody   = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''

  /* ── 2. Verify HMAC-SHA256 signature ────────────────────────── */
  const secret   = process.env.RAZORPAY_WEBHOOK_SECRET!
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')

  try {
    const a = Buffer.from(expected)
    const b = Buffer.from(signature)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      console.warn('[webhook] Invalid signature received.')
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 3. Parse event ─────────────────────────────────────────── */
  let event: { event: string; payload: { payment: { entity: Record<string, unknown> } } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  // Only act on payment.captured (money is confirmed collected)
  if (event.event !== 'payment.captured') {
    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })
  }

  /* ── 4. Extract payment data ────────────────────────────────── */
  const payment    = event.payload?.payment?.entity ?? {}
  const paymentId  = payment.id as string
  const notes      = (payment.notes ?? {}) as Record<string, string>
  const amountPaid = typeof payment.amount === 'number' ? payment.amount / 100 : 0
  const admin      = createAdminClient()

  /* ── 5. Branch on notes.type ────────────────────────────────── */
  if (notes.type === 'consultation') {
    return handleConsultation({ admin, paymentId, notes, amountPaid, orderId: payment.order_id as string })
  }

  return handleCoursePurchase({ admin, paymentId, notes, amountPaid })
}

/* ═══════════════════════════════════════════════════════════════
   Handler: Course Purchase
   ═══════════════════════════════════════════════════════════════ */
async function handleCoursePurchase({
  admin, paymentId, notes, amountPaid,
}: {
  admin:      ReturnType<typeof import('@/lib/supabase/admin').createAdminClient>
  paymentId:  string
  notes:      Record<string, string>
  amountPaid: number
}) {
  const userId   = notes.user_id
  const courseId = notes.course_id

  if (!userId || !courseId || !paymentId) {
    console.error('[webhook/course] Missing required fields:', { userId, courseId, paymentId })
    return new Response(JSON.stringify({ error: 'Missing payment metadata' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  // Idempotency check
  const { data: existing } = await admin
    .from('purchases')
    .select('id')
    .eq('razorpay_payment_id', paymentId)
    .maybeSingle()

  if (existing) {
    console.log('[webhook/course] Already recorded, skipping:', paymentId)
    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })
  }

  const { error: insertErr } = await admin.from('purchases').insert({
    user_id:             userId,
    course_id:           courseId,
    razorpay_payment_id: paymentId,
    amount_paid:         amountPaid,
    status:              'success',
  })

  if (insertErr) {
    console.error('[webhook/course] DB insert failed:', insertErr)
    return new Response(JSON.stringify({ error: 'DB insert failed' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log('[webhook/course] Purchase recorded:', { userId, courseId, paymentId })
  return new Response(JSON.stringify({ received: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  })
}

/* ═══════════════════════════════════════════════════════════════
   Handler: Consultation Booking
   ═══════════════════════════════════════════════════════════════ */
async function handleConsultation({
  admin, paymentId, notes, amountPaid, orderId,
}: {
  admin:      ReturnType<typeof import('@/lib/supabase/admin').createAdminClient>
  paymentId:  string
  notes:      Record<string, string>
  amountPaid: number
  orderId:    string
}) {
  if (!paymentId) {
    console.error('[webhook/consultation] Missing payment ID')
    return new Response(JSON.stringify({ error: 'Missing payment ID' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  // Idempotency check
  const { data: existing } = await admin
    .from('consultations')
    .select('id')
    .eq('razorpay_payment_id', paymentId)
    .maybeSingle()

  if (existing) {
    console.log('[webhook/consultation] Already recorded, skipping:', paymentId)
    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })
  }

  const { error: insertErr } = await admin.from('consultations').insert({
    guest_name:          notes.guest_name  || null,
    guest_email:         notes.guest_email || null,
    guest_phone:         notes.guest_phone || null,
    razorpay_order_id:   orderId           || null,
    razorpay_payment_id: paymentId,
    amount_paid:         amountPaid,
    status:              'success',
  })

  if (insertErr) {
    console.error('[webhook/consultation] DB insert failed:', insertErr)
    return new Response(JSON.stringify({ error: 'DB insert failed' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log('[webhook/consultation] Consultation recorded:', paymentId)
  return new Response(JSON.stringify({ received: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  })
}
