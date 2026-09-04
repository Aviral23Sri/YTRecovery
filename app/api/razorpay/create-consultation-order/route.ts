import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const razorpay = new Razorpay({
  key_id:     process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

/** Fixed server-side price — never trust the client */
const CONSULTATION_PRICE_INR = 999

export async function POST(request: Request) {
  /* ── 1. Parse body (all optional — guest-friendly) ─────────── */
  let guestName  = ''
  let guestEmail = ''
  let guestPhone = ''
  try {
    const body = await request.json()
    guestName  = (body?.name  ?? '').toString().trim()
    guestEmail = (body?.email ?? '').toString().trim()
    guestPhone = (body?.phone ?? '').toString().trim()
  } catch {
    // body is optional — continue without it
  }

  /* ── 2. If logged-in, use their email as fallback ───────────── */
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user && !guestEmail) guestEmail = user.email ?? ''
  } catch {
    // not logged in — fine
  }

  /* ── 3. Create Razorpay order (price is ALWAYS server-side) ── */
  try {
    const order = await razorpay.orders.create({
      amount:   CONSULTATION_PRICE_INR * 100, // paise — fixed, not client-supplied
      currency: 'INR',
      notes: {
        type:        'consultation',
        guest_name:  guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount:   order.amount,
      currency: order.currency,
      // pass back prefill data so the client can pre-populate the Razorpay modal
      prefill: {
        name:    guestName,
        email:   guestEmail,
        contact: guestPhone,
      },
    })
  } catch (err: unknown) {
    console.error('Razorpay create-consultation-order error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message || 'Failed to create order.' }, { status: 500 })
  }
}
