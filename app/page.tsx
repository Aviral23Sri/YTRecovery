import type { Metadata } from 'next'
import Link from 'next/link'
import SignalLine from '@/components/SignalLine'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'YTRecovery — Recover Your YouTube Channel & Monetization',
  description:
    'Get your suspended or demonetized YouTube channel back. Learn the real system behind YouTube policy enforcement and the exact strategy to recover — from a creator who has done it.',
}

/* Real YouTube videos from Akash Kanojiya's channel */
const SAMPLE_VIDEOS = [
  { id: 'QxQfuSKmz04', title: 'Watch this video from Akash Kanojiya' },
  { id: 'Mxc3XkYYdhg', title: 'Watch this video from Akash Kanojiya' },
  { id: '3eNTmiBgNtQ', title: 'Watch this video from Akash Kanojiya' },
]

/* Hard-coded course data for Phase 1 (no DB connection yet) */
const COURSE_PREVIEW = {
  slug: 'youtube-monetization-recovery-2026',
  price: 4999,
  moduleCount: 8,
  lessonCount: 31,
}

// [PLACEHOLDER: Real student testimonials — replace with verified quotes from actual students before publishing]

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
      {/* [PLACEHOLDER: Replace num values with verified, real stats before publishing] */}
      <section className={styles.proofStrip} aria-label="Social proof">
        <div className="container">
          <div className={styles.proofGrid}>
            {[
              { num: '[PLACEHOLDER]', label: 'Creators Enrolled' },
              { num: '[PLACEHOLDER]', label: 'Appeal Success Rate' },
              { num: '[PLACEHOLDER]', label: 'Avg. Recovery Time' },
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
              <h2 id="about-heading">Akash Kanojiya</h2>
              <p style={{ marginTop: 'var(--space-4)' }}>
                Official Website of Akash YouTuber. Helping YouTube creators build original,
                monetizable channels through practical strategies, in-depth courses, and proven guidance.
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
      {/* [PLACEHOLDER: Add real student testimonials here once collected.
           Use the testimonialGrid / testimonialCard CSS classes already defined.
           Each card needs: a quote, student name, handle, and recovered badge.] */}

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
