import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About — Akash Kanojiya',
  description:
    'Official Website of Akash YouTuber. Helping YouTube creators build original, monetizable channels through practical strategies, in-depth courses, and proven guidance.',
}

const FOCUS_AREAS = [
  'YouTube Monetization Recovery',
  'Original Content Strategy',
  'Channel Growth & Optimization',
  'Creator Education & Support',
]

export default function AboutPage() {
  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <span className="badge badge--accent">About the Instructor</span>
          <h1 style={{ marginTop: 'var(--space-4)' }}>Akash Kanojiya</h1>

          <div className={styles.body}>
            <p>
              Official Website of Akash YouTuber. Helping YouTube creators build original,
              monetizable channels through practical strategies, in-depth courses, and proven guidance.
            </p>

            <div className={styles.focusAreas}>
              <span className="mono" style={{ color: 'var(--color-muted)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Focus Areas
              </span>
              <ul className={styles.focusList} role="list">
                {FOCUS_AREAS.map((area) => (
                  <li key={area} className={styles.focusItem}>
                    <span className={styles.focusDot} aria-hidden="true" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            {/* [PLACEHOLDER: Add longer bio, background story, and credibility markers here] */}
          </div>
        </div>
      </div>
    </section>
  )
}
