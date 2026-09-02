import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Browse all available YouTube channel recovery and monetization courses.',
}

const COURSES = [
  {
    slug: 'youtube-monetization-recovery-2026',
    title: 'YouTube Monetization Recovery Master Course 2026',
    description: 'The complete system for recovering suspended/demonetized channels — and keeping them safe.',
    price: 4999,
    originalPrice: 7999,
    moduleCount: 8,
    lessonCount: 31,
    tag: 'Bestseller',
    thumbnail_url: '/course-thumbnail.jpg',
  },
]

export default function CoursesPage() {
  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <span className="badge badge--accent">All Courses</span>
          <h1 style={{ marginTop: 'var(--space-3)' }}>Master your creator career</h1>
          <p style={{ marginTop: 'var(--space-3)', maxWidth: 520 }}>
            Real, in-depth courses for YouTube creators navigating policy, monetization, and recovery.
          </p>
        </div>

        <div className={styles.grid} role="list">
          {COURSES.map((c) => (
            <article key={c.slug} className={styles.card} role="listitem">
              <div className={styles.cardThumbnail} aria-hidden="true">
                {c.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.thumbnail_url}
                    alt={c.title}
                    className={styles.thumbnailImg}
                  />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M8 30 Q14 14 20 20 Q26 26 32 8" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
                {c.tag && <span className={`badge badge--accent ${styles.cardBadge}`}>{c.tag}</span>}
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{c.title}</h2>
                <p className={styles.cardDesc}>{c.description}</p>
                <div className={styles.cardMeta}>
                  <span className="mono" style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>
                    {c.moduleCount} modules · {c.lessonCount} lessons
                  </span>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardPrice}>
                    <span className={styles.price}>₹{c.price.toLocaleString('en-IN')}</span>
                    <span className={styles.origPrice}>₹{c.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <Link href={`/courses/${c.slug}`} className="btn btn--primary">
                    View Course
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
