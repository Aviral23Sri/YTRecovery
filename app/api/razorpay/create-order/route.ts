import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id:     process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  /* ── 1. Authenticate ─────────────────────────────────────── */
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  /* ── 2. Parse + validate body ────────────────────────────── */
  let courseId: string
  try {
    const body = await request.json()
    courseId   = body?.courseId
    if (!courseId || typeof courseId !== 'string') throw new Error()
  } catch {
    return NextResponse.json({ error: 'courseId is required.' }, { status: 400 })
  }

  /* ── 3. Fetch course price from DB (never trust client price) */
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, title, price')
    .eq('id', courseId)
    .eq('is_published', true)
    .single()

  if (courseErr || !course) {
    return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  }

  /* ── 4. Check for existing successful purchase ───────────── */
  const { data: existing } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('status', 'success')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Already purchased.' }, { status: 409 })
  }

  /* ── 5. Create Razorpay order ────────────────────────────── */
  try {
    const order = await razorpay.orders.create({
      amount:   Math.round(Number(course.price) * 100), // paise
      currency: 'INR',
      notes: {
        user_id:   user.id,
        course_id: courseId,
        user_email: user.email ?? '',
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount:   order.amount,
      currency: order.currency,
    })
  } catch (err: unknown) {
    console.error('[create-order] Razorpay error:', err)
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 })
  }
}
