'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signupAction } from './actions'
import { googleLoginAction } from '../login/actions'
import styles from '../login/page.module.css'

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, undefined)

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.lockIcon} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.sub}>Join once. Learn at your own pace.</p>
        </div>

        {state?.error && (
          <div className={styles.errorBanner} role="alert" aria-live="polite">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 4v3M7 10h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {state.error}
          </div>
        )}

        <form action={action} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="signup-name" className={styles.label}>Full Name</label>
            <input
              id="signup-name"
              name="full_name"
              type="text"
              autoComplete="name"
              className={styles.input}
              placeholder="Akash Kumar"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-email" className={styles.label}>Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-password" className={styles.label}>Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className={styles.input}
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className={`btn btn--primary ${styles.submit}`}
            id="signup-submit"
          >
            {pending
              ? <><span className={styles.spinner} aria-hidden="true" /> Creating account…</>
              : 'Create Account'}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <form action={googleLoginAction}>
          <button type="submit" className={styles.googleBtn} id="signup-google">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <p className={styles.switchLink}>
          Already have an account?{' '}
          <Link href="/auth/login" className={styles.anchor}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
