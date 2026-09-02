import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createHmac, timingSafeEqual } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/razorpay/verify-payment
 *
 * Called by the client-side EnrollButton AFTER the Razorpay modal closes
 * successfully. This is a FALLBACK to the webhook — it verifies the
 * payment signature client-side and records the purchase if the webhook
 * hasn't fired yet.
 *
 * Security: We verify the Razorpay payment signature (HMAC-SHA256) using
 * the server-side key. This is equivalent to webhook signature verification
 * and cannot be spoofed by the client.
 */
export async function POST(request: Request) {
  /* ── 1. Authenticate ──────────────────────────────────────── */
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  /* ── 2. Parse body ────────────────────────────────────────── */
  let razorpay_order_id: string
  let razorpay_payment_id: string
  let razorpay_signature: string
  let courseId: string

  try {
    const body = await request.json()
    razorpay_order_id   = body.razorpay_order_id
    razorpay_payment_id = body.razorpay_payment_id
    razorpay_signature  = body.razorpay_signature
    courseId            = body.courseId
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) throw new Error()
  } catch {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  /* ── 3. Verify Razorpay payment signature (server-side) ──── */
  const key_secret = process.env.RAZORPAY_KEY_SECRET!
  const generated  = createHmac('sha256', key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  try {
    const a = Buffer.from(generated)
    const b = Buffer.from(razorpay_signature)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      console.warn('[verify-payment] Invalid signature for payment:', razorpay_payment_id)
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 401 })
  }

  /* ── 4. Verify course exists ──────────────────────────────── */
  const { data: course } = await supabase
    .from('courses')
    .select('id, price')
    .eq('id', courseId)
    .eq('is_published', true)
    .single()

  if (!course) {
    return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  }

  /* ── 5. Idempotency — skip if already recorded ────────────── */
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('purchases')
    .select('id')
    .eq('razorpay_payment_id', razorpay_payment_id)
    .maybeSingle()

  if (existing) {
    // Already recorded (probably by webhook) — just return success
    console.log('[verify-payment] Already recorded, skipping:', razorpay_payment_id)
    return NextResponse.json({ success: true })
  }

  /* ── 6. Fetch payment amount from Razorpay API ────────────── */
  let amountPaid = Number(course.price)
  try {
    const razorpay = new Razorpay({
      key_id:     process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
    const payment = await razorpay.payments.fetch(razorpay_payment_id)
    amountPaid = typeof payment.amount === 'number' ? payment.amount / 100 : amountPaid
  } catch (e) {
    console.warn('[verify-payment] Could not fetch payment amount, using course price as fallback:', e)
  }

  /* ── 7. Insert purchase ───────────────────────────────────── */
  const { error: insertErr } = await admin.from('purchases').insert({
    user_id:             user.id,
    course_id:           courseId,
    razorpay_payment_id: razorpay_payment_id,
    amount_paid:         amountPaid,
    status:              'success',
  })

  if (insertErr) {
    console.error('[verify-payment] Failed to insert purchase:', insertErr)
    return NextResponse.json({ error: 'Could not record purchase.' }, { status: 500 })
  }

  console.log('[verify-payment] Purchase recorded successfully:', { userId: user.id, courseId, razorpay_payment_id })
  return NextResponse.json({ success: true })
}
