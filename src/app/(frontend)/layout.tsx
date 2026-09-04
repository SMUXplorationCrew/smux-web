import type { Metadata } from 'next'
import { Barlow, Saira_Condensed } from 'next/font/google'
import type React from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { RevealObserver } from '@/components/RevealObserver'
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from '@/lib/site'
import './globals.css'

// Loaded as CSS variables rather than by family name: next/font emits a hashed
// family, so globals.css points --font-display/--font-body at these instead.
const sairaCondensed = Saira_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-saira-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  // Absolute base, or Next emits relative OG URLs that crawlers cannot resolve.
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: '%s · SMUX',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'SMUX',
    locale: 'en_SG',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image' },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    // suppressHydrationWarning covers the data-js attribute the script below sets:
    // React did not render it, and without this it warns on every page.
    <html
      className={`${sairaCondensed.variable} ${barlow.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        {/*
          Marks that JavaScript is running, before anything paints.
          Scroll-in animations hide their subject only under this attribute, so a
          visitor with JS disabled or broken gets a fully visible page rather than a
          blank one waiting on an observer that will never run.
        */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed literal with no interpolation, which has to execute before first paint — next/script cannot run that early.
          dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }}
        />
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:font-display focus:text-meta focus:text-paper focus:uppercase"
          href="#main"
        >
          Skip to content
        </a>
        <Header />
        <main className="flex-1" id="main">
          {children}
        </main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  )
}
