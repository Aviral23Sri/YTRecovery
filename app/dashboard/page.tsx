import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import DashboardAccordion from '@/components/DashboardAccordion'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'My Dashboard — YTRecovery',
  description: 'Access your purchased YouTube Monetization Recovery course.',
}

// ── Types ─────────────────────────────────────────────────────────
interface Lesson {
  id:               string
  title:            string
  youtube_video_id: string | null
  position:         number
  duration_minutes: number | null
}

interface Module {
  id:       string
  title:    string
  position: number
  lessons:  Lesson[]
}

interface PurchasedCourse {
  id:      string
  title:   string
  modules: Module[]
}

// ── Page ──────────────────────────────────────────────────────────
export default async function DashboardPage() {
  /* 1 — Auth guard ——————————————————————————————————————————————— */
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user ?? null

  if (!user) {
    redirect('/auth/login?next=/dashboard')
  }

  /* 2 — Query purchases (RLS: user sees only their own rows) ————— */
  const { data: purchases } = await supabase
    .from('purchases')
    .select('course_id')
    .eq('status', 'success')

  /* 3 — Empty state ——————————————————————————————————————————————— */
  if (!purchases?.length) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.emptyWrap}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={styles.emptyTitle}>No courses yet</h1>
            <p className={styles.emptySub}>
              You haven&apos;t purchased a course. Enroll once and access everything here.
            </p>
            <Link href="/courses" className="btn btn--primary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* 4 — Fetch purchased courses ———————————————————————————————— */
  const courseIds = purchases.map((p) => p.course_id as string)

  const { data: coursesRaw } = await supabase
    .from('courses')
    .select('id, title')
    .in('id', courseIds)

  /* 5 — Fetch modules + lessons (RLS on lessons enforces purchase) */
  // The lessons RLS policy uses EXISTS(purchases) so only rows for
  // courses the user has purchased are returned. No CSS hiding needed.
  const { data: modulesRaw } = await supabase
    .from('modules')
    .select(`
      id,
      title,
      position,
      course_id,
      lessons (
        id,
        title,
        youtube_video_id,
        position,
        duration_minutes
      )
    `)
    .in('course_id', courseIds)
    .order('position', { ascending: true })

  /* 6 — Shape data ————————————————————————————————————————————— */
  const courses: PurchasedCourse[] = (coursesRaw ?? []).map((c) => ({
    id:    c.id,
    title: c.title,
    modules: (modulesRaw ?? [])
      .filter((m) => m.course_id === c.id)
      .sort((a, b) => a.position - b.position)
      .map((m) => ({
        id:       m.id,
        title:    m.title,
        position: m.position,
        lessons:  ((m.lessons as Lesson[] | null) ?? [])
          .sort((a, b) => a.position - b.position),
      })),
  }))

  /* 7 — Render ————————————————————————————————————————————————— */
  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <span className="badge badge--accent">My Courses</span>
            <h1 className={styles.heading}>Your Dashboard</h1>
            <p className={styles.sub}>
              Welcome back, {user.email?.split('@')[0]}. Your course content is below.
            </p>
          </div>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="btn btn--ghost" id="dashboard-signout">
              Sign Out
            </button>
          </form>
        </div>

        {/* Courses */}
        {courses.map((course) => (
          <section key={course.id} className={styles.courseSection}>
            <div className={styles.courseHeader}>
              <h2 className={styles.courseTitle}>{course.title}</h2>
              <span className={styles.badge}>
                {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
              </span>
            </div>

            {/*
              DashboardAccordion is a CLIENT component.
              It receives the lesson data (already RLS-verified) as props.
              Videos only appear in the HTML because the server confirmed purchase.
            */}
            <DashboardAccordion modules={course.modules} />
          </section>
        ))}
      </div>
    </div>
  )
}
