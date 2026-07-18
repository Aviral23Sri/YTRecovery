import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with YTRecovery.',
}

const CONTACT_LINKS = [
  { label: 'Email', value: '[PLACEHOLDER: email@example.com]', href: 'mailto:[PLACEHOLDER]', icon: '✉' },
  { label: 'Phone / WhatsApp', value: '[PLACEHOLDER: +91 XXXXX XXXXX]', href: 'tel:[PLACEHOLDER]', icon: '📱' },
  { label: 'Instagram', value: '@[PLACEHOLDER]', href: 'https://instagram.com/[PLACEHOLDER]', icon: '📸' },
  { label: 'YouTube Channel', value: '[PLACEHOLDER: Channel Name]', href: 'https://youtube.com/@[PLACEHOLDER]', icon: '▶' },
]

export default function ContactPage() {
  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <span className="badge badge--accent">Get in Touch</span>
          <h1 style={{ marginTop: 'var(--space-4)' }}>Contact</h1>
          <p style={{ maxWidth: 480 }}>
            Have questions before enrolling? Reach out on any of the platforms below.
          </p>
          <div className={styles.links}>
            {CONTACT_LINKS.map((c) => (
              <a key={c.label} href={c.href} className={styles.contactCard}>
                <span className={styles.icon} aria-hidden="true">{c.icon}</span>
                <div>
                  <span className={styles.contactLabel}>{c.label}</span>
                  <span className={styles.contactValue}>{c.value}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
