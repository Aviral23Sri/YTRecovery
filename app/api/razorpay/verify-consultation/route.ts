import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/razorpay/verify-consultation
 *
 * Client-side fallback called after the Razorpay modal closes.
 * Verifies the HMAC-SHA256 payment signature and inserts a consultation
 * record if the webhook hasn't already done so.
 *
 * No auth required — works for guests.
 */
export const runtime = 'nodejs'

export async function POST(request: Request) {
  /* ── 1. Parse body ────────────────────────────────────────────── */
  let razorpay_order_id: string
  let razorpay_payment_id: string
  let razorpay_signature: string
  let guestName:  string
  let guestEmail: string
  let guestPhone: string

  try {
    const body = await request.json()
    razorpay_order_id   = body.razorpay_order_id
    razorpay_payment_id = body.razorpay_payment_id
    razorpay_signature  = body.razorpay_signature
    guestName  = (body.name  ?? '').toString().trim()
    guestEmail = (body.email ?? '').toString().trim()
    guestPhone = (body.phone ?? '').toString().trim()
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) throw new Error()
  } catch {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  /* ── 2. Verify HMAC-SHA256 payment signature ──────────────────── */
  const key_secret = process.env.RAZORPAY_KEY_SECRET!
  const generated  = createHmac('sha256', key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  try {
    const a = Buffer.from(generated)
    const b = Buffer.from(razorpay_signature)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      console.warn('[verify-consultation] Invalid signature:', razorpay_payment_id)
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 401 })
  }

  /* ── 3. Idempotency — skip if already recorded ────────────────── */
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('consultations')
    .select('id')
    .eq('razorpay_payment_id', razorpay_payment_id)
    .maybeSingle()

  if (existing) {
    console.log('[verify-consultation] Already recorded:', razorpay_payment_id)
    return NextResponse.json({ success: true })
  }

  /* ── 4. Insert consultation record ────────────────────────────── */
  const { error: insertErr } = await admin.from('consultations').insert({
    guest_name:          guestName  || null,
    guest_email:         guestEmail || null,
    guest_phone:         guestPhone || null,
    razorpay_order_id:   razorpay_order_id,
    razorpay_payment_id: razorpay_payment_id,
    amount_paid:         999,
    status:              'success',
  })

  if (insertErr) {
    console.error('[verify-consultation] DB insert failed:', insertErr)
    return NextResponse.json({ error: 'Could not record consultation.' }, { status: 500 })
  }

  console.log('[verify-consultation] Consultation recorded:', razorpay_payment_id)
  return NextResponse.json({ success: true })
}
