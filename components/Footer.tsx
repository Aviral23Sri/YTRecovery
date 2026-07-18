import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            <svg width="20" height="16" viewBox="0 0 22 18" fill="none">
              <path d="M1 12 Q5 4 9 9 Q13 14 17 3 L21 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <p className={styles.tagline}>
            From flagged to funded. Real strategies for YouTube recovery.
          </p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <div className={styles.col}>
            <span className={styles.colLabel}>Platform</span>
            <Link href="/courses">Courses</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/auth/login">Sign In</Link>
          </div>
          <div className={styles.col}>
            <span className={styles.colLabel}>Company</span>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} YTRecovery. All rights reserved.
        </p>
        <p className={styles.disclaimer}>
          Not affiliated with YouTube or Google LLC.
        </p>
      </div>
    </footer>
  )
}
