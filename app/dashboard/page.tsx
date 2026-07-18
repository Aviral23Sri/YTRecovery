import Link from 'next/link'
import styles from './page.module.css'

export default function DashboardPage() {
  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1>My Courses</h1>
          <span className="badge badge--accent">Phase 2 — coming soon</span>
        </div>
        <div className={styles.empty}>
          <p>You haven&apos;t purchased any courses yet.</p>
          <Link href="/courses" className="btn btn--primary" style={{ marginTop: 'var(--space-5)' }}>
            Browse Courses
          </Link>
        </div>
      </div>
    </section>
  )
}
