import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SignalLine from '@/components/SignalLine'
import CurriculumAccordion, { type Module } from '@/components/CurriculumAccordion'
import styles from './page.module.css'

/* ─────────────────────────────────────────────────────────────
   Phase 1: hard-coded course data (no DB connection yet).
   In Phase 2 this will be replaced with a Supabase server query.
   Replace the [PLACEHOLDER] fields with real client content.
───────────────────────────────────────────────────────────── */
const COURSE = {
  id: 'yt-recovery-2026',
  slug: 'youtube-monetization-recovery-2026',
  title: 'YouTube Monetization Recovery Master Course 2026',
  tagline: 'The complete system for getting suspended and demonetized channels back — and keeping them that way.',
  description: `Your channel getting suspended or demonetized isn't the end of your creator career — but sending generic appeals and hoping for the best is. This course teaches you how YouTube's policy engine actually works, why most appeals fail, and exactly how to write an appeal that reads like someone who genuinely understands the rules and deserves another chance.

Across 8 modules and 31 lessons, you'll go from frustrated to fluent in YouTube's review system. You'll understand the inauthentic content flags that catch most creators off guard, how related-channel suspensions work, and the 30-day reapply strategy that has helped hundreds of creators get reinstated.`,
  price: 4999,
  originalPrice: 7999,
  thumbnail_url: null,
  highlights: [
    'Understand how YouTube flags, reviews, and strikes actually work',
    'Decode every type of suspension: inauthentic content, related channel, policy strike',
    'Write appeals that reviewers actually read and approve',
    'Execute the 30-day reapply strategy with a structured checklist',
    'Build a future-safe content operation that doesn\'t risk a repeat',
    'Diversify revenue so you\'re never hostage to YPP status again',
  ],
  modules: [
    {
      id: 'm0', title: 'Introduction & Roadmap', position: 0,
      lessons: [
        { id: 'l01', title: 'Welcome & What This Course Covers', position: 1, duration_minutes: 5.0 },
        { id: 'l02', title: 'How to Use This Course', position: 2, duration_minutes: 3.5 },
        { id: 'l03', title: 'Your Recovery Roadmap', position: 3, duration_minutes: 8.0 },
      ],
    },
    {
      id: 'm1', title: 'Module 01 — YouTube System Logic', position: 1,
      lessons: [
        { id: 'l11', title: "How YouTube's Policy Engine Actually Works", position: 1, duration_minutes: 12.0 },
        { id: 'l12', title: 'The Flag → Review → Strike Pipeline', position: 2, duration_minutes: 10.5 },
        { id: 'l13', title: "Why Automated Systems Get It Wrong", position: 3, duration_minutes: 9.0 },
        { id: 'l14', title: 'What "Trust Score" Really Means', position: 4, duration_minutes: 11.0 },
      ],
    },
    {
      id: 'm2', title: 'Module 02 — Inauthentic Content Deep Dive', position: 2,
      lessons: [
        { id: 'l21', title: 'What YouTube Classifies as Inauthentic', position: 1, duration_minutes: 13.0 },
        { id: 'l22', title: 'Reused Content: The Grey Zone', position: 2, duration_minutes: 11.0 },
        { id: 'l23', title: 'Spam, Deceptive Practices & Manipulation', position: 3, duration_minutes: 10.0 },
        { id: 'l24', title: 'Case Studies: Channels That Got It Wrong', position: 4, duration_minutes: 14.5 },
      ],
    },
    {
      id: 'm3', title: 'Module 03 — Related Channel Suspension Deep Dive', position: 3,
      lessons: [
        { id: 'l31', title: 'How YouTube Links Accounts', position: 1, duration_minutes: 12.0 },
        { id: 'l32', title: 'Device Fingerprinting & IP Signals', position: 2, duration_minutes: 10.0 },
        { id: 'l33', title: 'Breaking the Link: What Actually Works', position: 3, duration_minutes: 15.0 },
        { id: 'l34', title: "Starting Fresh Without Getting Flagged Again", position: 4, duration_minutes: 11.5 },
      ],
    },
    {
      id: 'm4', title: 'Module 04 — Appeal Psychology', position: 4,
      lessons: [
        { id: 'l41', title: 'Who Reads Your Appeal (and What They Look For)', position: 1, duration_minutes: 9.0 },
        { id: 'l42', title: 'The Anatomy of a Winning Appeal', position: 2, duration_minutes: 16.0 },
        { id: 'l43', title: 'Language, Tone & Framing Mistakes to Avoid', position: 3, duration_minutes: 11.0 },
        { id: 'l44', title: 'Writing Your Appeal: Live Walkthrough', position: 4, duration_minutes: 20.0 },
      ],
    },
    {
      id: 'm5', title: 'Module 05 — Reapply Strategy', position: 5,
      lessons: [
        { id: 'l51', title: 'When to Reapply (Timing Is Everything)', position: 1, duration_minutes: 8.0 },
        { id: 'l52', title: 'Rebuilding Metrics Before Reapplying', position: 2, duration_minutes: 12.0 },
        { id: 'l53', title: 'The 30-Day Prep Checklist', position: 3, duration_minutes: 10.0 },
        { id: 'l54', title: 'What to Do If Rejected Again', position: 4, duration_minutes: 9.5 },
      ],
    },
    {
      id: 'm6', title: 'Module 06 — Future-Safe Strategy', position: 6,
      lessons: [
        { id: 'l61', title: 'Building a Policy-Resilient Content Strategy', position: 1, duration_minutes: 14.0 },
        { id: 'l62', title: 'Metadata, Thumbnails & Title Hygiene', position: 2, duration_minutes: 11.0 },
        { id: 'l63', title: "Diversifying Revenue So You're Never Hostage to YPP", position: 3, duration_minutes: 13.0 },
        { id: 'l64', title: 'Community Guidelines: Staying Ahead of Changes', position: 4, duration_minutes: 10.0 },
      ],
    },
    {
      id: 'm7', title: 'Module 07 — Final Reality & Mindset', position: 7,
      lessons: [
        { id: 'l71', title: 'The Truth About Recovery Timelines', position: 1, duration_minutes: 9.0 },
        { id: 'l72', title: 'Managing the Emotional Toll', position: 2, duration_minutes: 8.5 },
        { id: 'l73', title: 'What Success Actually Looks Like', position: 3, duration_minutes: 7.0 },
        { id: 'l74', title: 'Final Message & Next Steps', position: 4, duration_minutes: 6.0 },
      ],
    },
  ] satisfies Module[],
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: COURSE.title,
    description: COURSE.tagline,
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  if (slug !== COURSE.slug) notFound()

  const discount = Math.round((1 - COURSE.price / COURSE.originalPrice) * 100)

  return (
    <div className={styles.page}>
      {/* ── Course Hero ── */}
      <section className={styles.courseHero} aria-labelledby="course-title">
        <div className="container">
          <div className={styles.heroInner}>
            {/* Left — course info */}
            <div className={styles.heroLeft}>
              <div className={styles.heroBreadcrumb}>
                <Link href="/courses" className={styles.breadcrumbLink}>All Courses</Link>
                <span aria-hidden="true"> / </span>
                <span className={styles.breadcrumbCurrent}>This course</span>
              </div>

              <div className={styles.courseBadges}>
                <span className="badge badge--accent">
                  <span aria-hidden="true">●</span> Monetization
                </span>
                <span className="badge badge--accent">Appeals</span>
                <span className="badge badge--accent">Policy</span>
              </div>

              <h1 id="course-title" className={styles.courseTitle}>{COURSE.title}</h1>
              <p className={styles.courseTagline}>{COURSE.tagline}</p>

              <div className={styles.courseMeta}>
                <span className="mono" style={{ color: 'var(--color-muted)', fontSize: '0.72rem' }}>
                  8 MODULES · 31 LESSONS · 6H+ CONTENT
                </span>
                <span className="badge badge--success">
                  <span aria-hidden="true">✓</span> Lifetime Access
                </span>
              </div>
            </div>

            {/* Right — sticky pricing card */}
            <aside className={styles.pricingCard} aria-label="Course pricing">
              <div className={styles.pricingHeader}>
                <div className={styles.priceRow}>
                  <span className={styles.price}>₹{COURSE.price.toLocaleString('en-IN')}</span>
                  <span className={styles.originalPrice}>₹{COURSE.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="badge badge--success">{discount}% off</span>
                </div>
                <p className={styles.pricingNote}>One-time payment · Lifetime access</p>
              </div>

              <Link
                href="/auth/signup"
                className={`btn btn--primary ${styles.enrollBtn}`}
                id="course-enroll-cta"
              >
                Enroll Now
              </Link>
              <Link
                href="#curriculum"
                className={`btn btn--outline ${styles.curriculumBtn}`}
              >
                View Full Curriculum ↓
              </Link>

              <ul className={styles.pricingFeatures} aria-label="What's included">
                {[
                  '31 video lessons',
                  'Lifetime access',
                  'Mobile + desktop',
                  'New lessons as policies update',
                  'Community support',
                ].map(f => (
                  <li key={f}>
                    <span className={styles.checkIcon} aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="var(--color-success)" strokeWidth="1.3"/>
                        <path d="M4.5 7L6.5 9L9.5 5.5" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Signal Line Divider ── */}
      <div className="container" aria-hidden="true">
        <SignalLine variant="divider" />
      </div>

      {/* ── What You'll Learn ── */}
      <section className={`section ${styles.learnSection}`} aria-labelledby="learn-heading">
        <div className="container">
          <h2 id="learn-heading" className={styles.sectionTitle}>What you&apos;ll learn</h2>
          <ul className={styles.highlightGrid} role="list">
            {COURSE.highlights.map((h) => (
              <li key={h} className={styles.highlightItem}>
                <span className={styles.highlightCheck} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Description ── */}
      <section className={`section ${styles.descSection}`} aria-labelledby="desc-heading">
        <div className="container">
          <div className={styles.descGrid}>
            <div>
              <h2 id="desc-heading" className={styles.sectionTitle}>About this course</h2>
              {COURSE.description.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginTop: i > 0 ? 'var(--space-4)' : 'var(--space-5)' }}>
                  {para}
                </p>
              ))}
            </div>
            <div className={styles.whoFor}>
              <h3 className={styles.whoForTitle}>Who this is for</h3>
              <ul className={styles.whoForList}>
                {[
                  'Creators with suspended channels facing appeals',
                  'Channels demonetized and rejected from YPP',
                  'Creators at risk of a related-channel suspension',
                  'Anyone who wants to understand YouTube policy properly',
                ].map(item => (
                  <li key={item}>
                    <span aria-hidden="true" style={{ color: 'var(--color-accent)' }}>→ </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section
        id="curriculum"
        className={`section ${styles.curriculumSection}`}
        aria-labelledby="curriculum-heading"
      >
        <div className="container">
          <div className={styles.curriculumHeader}>
            <div>
              <h2 id="curriculum-heading" className={styles.sectionTitle}>Full curriculum</h2>
              <p style={{ marginTop: 'var(--space-3)' }}>
                All module and lesson titles are visible here. Videos unlock after enrollment.
              </p>
            </div>
            <div className={styles.lockedNote}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="2.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span>Videos locked until enrolled</span>
            </div>
          </div>
          <CurriculumAccordion modules={COURSE.modules} />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className={styles.bottomCta} aria-label="Enrollment call to action">
        <div className="container">
          <div className={styles.bottomCtaInner}>
            <div>
              <h2 className={styles.bottomCtaHeading}>Ready to get your channel back?</h2>
              <p>One-time payment. Lifetime access. Updates included as YouTube changes its policies.</p>
            </div>
            <div className={styles.bottomCtaRight}>
              <div className={styles.bottomPrice}>
                <span className={styles.price}>₹{COURSE.price.toLocaleString('en-IN')}</span>
                <span className={styles.originalPrice}>₹{COURSE.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <Link
                href="/auth/signup"
                className="btn btn--primary"
                id="bottom-course-enroll-cta"
                style={{ padding: '16px 36px', fontSize: '1.05rem' }}
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
