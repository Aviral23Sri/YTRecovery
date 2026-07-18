import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about the instructor behind YTRecovery.',
}

export default function AboutPage() {
  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <span className="badge badge--accent">About the Instructor</span>
          <h1 style={{ marginTop: 'var(--space-4)' }}>[PLACEHOLDER: Instructor Name]</h1>
          <div className={styles.body}>
            <p>
              [PLACEHOLDER: Full bio — background, suspension story, recovery journey, subscriber milestones,
              why they built this course.]
            </p>
            <p>
              [PLACEHOLDER: Credibility — years on YouTube, channel niche, public profile links, results achieved.]
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
