'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavLink } from '@/components/nav-links'

/**
 * The desktop menu, in the browser only so it can mark the current page.
 *
 * An eight-item menu with no current-page indicator makes a visitor re-read it on every
 * page to work out where they are. `startsWith` so /clubs stays lit on /clubs/diving.
 */
export const DesktopNav = ({ links }: { links: NavLink[] }) => {
  const pathname = usePathname()

  const isCurrent = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul className="flex items-center gap-6">
        {links.map((link) => {
          const current = isCurrent(link.href)
          return (
            <li key={link.href}>
              <Link
                aria-current={current ? 'page' : undefined}
                className={`nav-link flex min-h-11 items-center font-display text-eyebrow tracking-eyebrow uppercase transition-colors ${
                  current ? 'text-orange-text' : 'text-ink hover:text-orange-text'
                }`}
                data-current={current ? 'true' : undefined}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
