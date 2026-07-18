import Link from 'next/link'
import styles from './page.module.css'

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.sub}>Welcome back. Access your purchased courses.</p>
        <div className={styles.formStub}>
          <span className="badge badge--accent" style={{ alignSelf: 'center' }}>Auth coming in Phase 2</span>
        </div>
        <p className={styles.switch}>
          Don&apos;t have an account? <Link href="/auth/signup" className={styles.switchLink}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
