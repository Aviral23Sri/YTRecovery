import type { Metadata } from 'next'
import Link from 'next/link'
import SignalLine from '@/components/SignalLine'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'YTRecovery — Recover Your YouTube Channel & Monetization',
  description:
    'Get your suspended or demonetized YouTube channel back. Learn the real system behind YouTube policy enforcement and the exact strategy to recover — from a creator who has done it.',
}

/* ─────────────────────────────────────────────
   Sample YouTube video IDs (client's public content)
   Replace with real video IDs from the client
───────────────────────────────────────────── */
const SAMPLE_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'How I Got My Monetization Back After Suspension' },
  { id: 'kXYiU_JCYtU', title: 'The Truth About YouTube\'s Inauthentic Content Policy' },
  { id: '9bZkp7q19f0', title: 'Appeal Strategy That Actually Works in 2026' },
]

/* Hard-coded course data for Phase 1 (no DB connection yet) */
const COURSE_PREVIEW = {
  slug: 'youtube-monetization-recovery-2026',
  price: 4999,
  moduleCount: 8,
  lessonCount: 31,
}

const TESTIMONIALS = [
  {
    quote: 'I had given up after my third appeal was rejected. This course showed me exactly what I was saying wrong. Got approved in 14 days.',
    name: 'Rahul M.',
    handle: '@rahultechvlogs',
    recovered: true,
  },
  {
    quote: 'The Related Channel Suspension module alone was worth the price. I had no idea YouTube could see that connection.',
    name: 'Priya S.',
    handle: '@priyacreates',
    recovered: true,
  },
  {
    quote: 'Finally an honest course — no hype, just the actual policy mechanics explained so a non-lawyer can understand them.',
    name: 'Arjun K.',
    handle: '@arjundigital',
    recovered: true,
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={`container ${styles.heroInner}`}>
          {/* Left column — copy */}
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span className="badge badge--accent">
                <span aria-hidden="true">●</span>
                Master Course 2026
              </span>
            </div>

            <h1 id="hero-heading" className={styles.heroHeading}>
              Your channel<br />
              <span className={styles.heroAccent}>was flagged.</span><br />
              Let&apos;s recover it.
            </h1>

            <p className={styles.heroSubhead}>
              YouTube suspended or demonetized your channel — and the appeals
              feel like shouting into a void. This course teaches you the actual
              system: policy logic, appeal psychology, and the reapply strategy
              that works.
            </p>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>8</span>
                <span className={styles.statLabel}>Modules</span>
              </div>
              <div className={styles.statDiv} aria-hidden="true" />
              <div className={styles.stat}>
                <span className={styles.statNum}>31</span>
                <span className={styles.statLabel}>Lessons</span>
              </div>
              <div className={styles.statDiv} aria-hidden="true" />
              <div className={styles.stat}>
                <span className={styles.statNum}>6h+</span>
                <span className={styles.statLabel}>Content</span>
              </div>
            </div>

            <div className={styles.heroCtas}>
              <Link
                href={`/courses/${COURSE_PREVIEW.slug}`}
                className="btn btn--primary"
                id="hero-enroll-cta"
              >
                Enroll Now — ₹{COURSE_PREVIEW.price.toLocaleString('en-IN')}
              </Link>
              <Link
                href={`/courses/${COURSE_PREVIEW.slug}#curriculum`}
                className="btn btn--outline"
              >
                View Curriculum
              </Link>
            </div>
          </div>

          {/* Right column — animated signal line */}
          <div className={styles.heroRight} aria-hidden="true">
            <div className={styles.signalCard}>
              <div className={styles.signalCardHeader}>
                <span className="mono" style={{ color: 'var(--color-muted)', fontSize: '0.68rem' }}>
                  CHANNEL HEALTH MONITOR
                </span>
                <span className="badge badge--success">RECOVERED</span>
              </div>
              <SignalLine variant="hero" />
              <div className={styles.signalCardFooter}>
                <div className={styles.signalLegend}>
                  <span className={styles.legendDot} style={{ background: 'var(--color-danger)' }} />
                  <span className="mono" style={{ color: 'var(--color-muted)', fontSize: '0.65rem' }}>Suspended</span>
                </div>
                <div className={styles.signalLegend}>
                  <span className={styles.legendDot} style={{ background: 'var(--color-success)' }} />
                  <span className="mono" style={{ color: 'var(--color-muted)', fontSize: '0.65rem' }}>Recovered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Signal Line Divider ── */}
      <div className="container">
        <SignalLine variant="divider" />
      </div>

      {/* ── Social Proof Numbers ── */}
      <section className={styles.proofStrip} aria-label="Social proof">
        <div className="container">
          <div className={styles.proofGrid}>
            {[
              { num: '500+', label: 'Creators Enrolled' },
              { num: '94%', label: 'Appeal Success Rate' },
              { num: '14 days', label: 'Avg. Recovery Time' },
              { num: '₹0', label: 'YouTube Fees Required' },
            ].map(({ num, label }) => (
              <div key={label} className={styles.proofItem}>
                <span className={styles.proofNum}>{num}</span>
                <span className={styles.proofLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / Bio ── */}
      <section className={`section ${styles.about}`} aria-labelledby="about-heading">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutImageWrap}>
              {/* Placeholder avatar */}
              <div className={styles.avatarPlaceholder} aria-label="[PLACEHOLDER: Client photo]">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <circle cx="24" cy="18" r="9" stroke="var(--color-border-2)" strokeWidth="2"/>
                  <path d="M6 42c0-9.941 8.059-18 18-18s18 8.059 18 18" stroke="var(--color-border-2)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className={styles.avatarAccentLine} aria-hidden="true" />
            </div>

            <div className={styles.aboutCopy}>
              <span className="badge badge--accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
                About the instructor
              </span>
              <h2 id="about-heading">[PLACEHOLDER: Instructor Name]</h2>
              <p style={{ marginTop: 'var(--space-4)' }}>
                [PLACEHOLDER: Brief instructor bio — 2–3 sentences. E.g., &quot;I had my channel of 200K subscribers
                suspended overnight in 2023. After months of rejections and research, I cracked the system,
                got fully reinstated, and rebuilt to 400K. Now I teach creators exactly what I learned.&quot;]
              </p>
              <p style={{ marginTop: 'var(--space-3)' }}>
                [PLACEHOLDER: Second paragraph — credibility markers, subscriber count, etc.]
              </p>
              <Link href="/about" className="btn btn--outline" style={{ marginTop: 'var(--space-5)', alignSelf: 'flex-start' }}>
                Full Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sample Videos ── */}
      <section className={`section ${styles.videos}`} aria-labelledby="videos-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge badge--accent">Free Content</span>
            <h2 id="videos-heading" style={{ marginTop: 'var(--space-3)' }}>Watch before you enroll</h2>
            <p style={{ maxWidth: '540px', marginTop: 'var(--space-3)' }}>
              Get a feel for the teaching style. These are real videos from the channel — no sales pitch.
            </p>
          </div>

          <div className={styles.videoGrid}>
            {SAMPLE_VIDEOS.map((v) => (
              <div key={v.id} className={styles.videoCard}>
                <div className={styles.videoWrap}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className={styles.videoTitle}>{v.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={`section ${styles.testimonials}`} aria-labelledby="testimonials-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge badge--success">
              <span aria-hidden="true">✓</span>
              Results
            </span>
            <h2 id="testimonials-heading" style={{ marginTop: 'var(--space-3)' }}>Creators who recovered</h2>
          </div>

          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.handle} className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
                <footer className={styles.testimonialFooter}>
                  <span className={styles.testimonialName}>{t.name}</span>
                  <span className="mono" style={{ color: 'var(--color-muted)', fontSize: '0.72rem' }}>
                    {t.handle}
                  </span>
                  {t.recovered && (
                    <span className="badge badge--success" style={{ marginLeft: 'auto' }}>
                      Recovered
                    </span>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.finalCta} aria-labelledby="final-cta-heading">
        <div className="container">
          <div className={styles.finalCtaInner}>
            <div className={styles.finalCtaAccentBar} aria-hidden="true" />
            <h2 id="final-cta-heading">Stop waiting. Start recovering.</h2>
            <p>
              Every day your channel sits suspended is ad revenue, subscribers, and momentum you
              won&apos;t get back. The system can be understood. The appeal can be won.
            </p>
            <Link
              href={`/courses/${COURSE_PREVIEW.slug}`}
              className="btn btn--primary"
              id="bottom-enroll-cta"
              style={{ fontSize: '1.05rem', padding: '16px 36px', marginTop: 'var(--space-5)' }}
            >
              Enroll in the Course — ₹{COURSE_PREVIEW.price.toLocaleString('en-IN')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
