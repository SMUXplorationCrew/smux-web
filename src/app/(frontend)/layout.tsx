import { Barlow, Saira_Condensed } from 'next/font/google'
import type React from 'react'
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

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html className={`${sairaCondensed.variable} ${barlow.variable}`} lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
