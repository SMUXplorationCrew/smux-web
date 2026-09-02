import type { Metadata } from 'next'
import { Barlow, Saira_Condensed } from 'next/font/google'
import type React from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
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
  title: {
    default: 'SMUX — SMUXploration Crew',
    template: '%s · SMUX',
  },
  description:
    'The outdoor and adventure CCA at Singapore Management University. Six clubs: diving, kayaking, trekking, biking, skating and XSeed.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html className={`${sairaCondensed.variable} ${barlow.variable}`} lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
