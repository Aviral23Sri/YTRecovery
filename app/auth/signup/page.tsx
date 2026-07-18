import Link from 'next/link'
import styles from '../login/page.module.css'

export default function SignupPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.sub}>Start your recovery journey. Enroll in your first course.</p>
        <div className={styles.formStub}>
          <span className="badge badge--accent" style={{ alignSelf: 'center' }}>Auth coming in Phase 2</span>
        </div>
        <p className={styles.switch}>
          Already enrolled? <Link href="/auth/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
