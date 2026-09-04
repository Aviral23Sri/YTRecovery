import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: {
    default: 'YTRecovery — YouTube Monetization Recovery Master Course 2026',
    template: '%s | YTRecovery',
  },
  description:
    'The definitive guide to recovering suspended or demonetized YouTube channels. Real strategies, appeal psychology, and future-safe systems from a creator who has done it.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    title: 'YTRecovery — YouTube Monetization Recovery Master Course 2026',
    description: 'From flagged to funded. Real YouTube recovery strategies.',
    siteName: 'YTRecovery',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user ?? null
  } catch {
    user = null
  }

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Nav userEmail={user?.email} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
