'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './Nav.module.css'

export default function Nav({ userEmail }: { userEmail?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.header} role="banner">
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.inner}>
          {/* Brand */}
          <Link href="/" className={styles.brand} aria-label="Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/akash-logo.png"
              alt="Akash Youtuber"
              width={36}
              height={36}
              className={styles.brandLogo}
            />
            <span className={styles.brandText}>Akash<span className={styles.brandAccent}> Youtuber</span></span>
          </Link>

          {/* Desktop links */}
          <ul className={styles.links} role="list">
            <li><Link href="/" className={styles.link}>Home</Link></li>
            <li><Link href="/courses" className={styles.link}>Courses</Link></li>
            <li><Link href="/about" className={styles.link}>About</Link></li>
            <li><Link href="/contact" className={styles.link}>Contact</Link></li>
          </ul>

          {/* Desktop CTA */}
          <div className={styles.actions}>
            {userEmail ? (
              <>
                <Link href="/dashboard" className="btn btn--ghost">Dashboard</Link>
                <form action="/auth/signout" method="POST" style={{ margin: 0 }}>
                  <button type="submit" className="btn btn--primary">Sign Out</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn--ghost">Sign In</Link>
                <Link href="/courses" className="btn btn--primary">Enroll Now</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <span className={`${styles.line} ${open ? styles.lineOpen1 : ''}`} />
            <span className={`${styles.line} ${open ? styles.lineOpen2 : ''}`} />
            <span className={`${styles.line} ${open ? styles.lineOpen3 : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div id="mobile-menu" className={styles.mobileMenu}>
            <ul role="list">
              {[['/', 'Home'], ['/courses', 'Courses'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className={styles.mobileLink} onClick={() => setOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.mobileCtas}>
              {userEmail ? (
                <>
                  <Link href="/dashboard" className="btn btn--outline" onClick={() => setOpen(false)}>Dashboard</Link>
                  <form action="/auth/signout" method="POST" style={{ margin: 0, width: '100%' }}>
                    <button type="submit" className="btn btn--primary" style={{ width: '100%' }} onClick={() => setOpen(false)}>Sign Out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn--outline" onClick={() => setOpen(false)}>Sign In</Link>
                  <Link href="/courses" className="btn btn--primary" onClick={() => setOpen(false)}>Enroll Now</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
