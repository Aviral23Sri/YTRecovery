'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import styles from './Nav.module.css'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.header} role="banner">
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.inner}>
          {/* Brand */}
          <Link href="/" className={styles.brand} aria-label="Home">
            <Image
              src="/akash-logo.png"
              alt="Akash Youtuber"
              width={36}
              height={36}
              className={styles.brandLogo}
              priority
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
            <Link href="/auth/login" className="btn btn--ghost">Sign In</Link>
            <Link href="/courses" className="btn btn--primary">Enroll Now</Link>
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
              <Link href="/auth/login" className="btn btn--outline" onClick={() => setOpen(false)}>Sign In</Link>
              <Link href="/courses" className="btn btn--primary" onClick={() => setOpen(false)}>Enroll Now</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
