'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { NavLink } from '@/components/nav-links'

/**
 * One of the three deliberate client components. Everything else in the header is
 * server-rendered; only the open/closed toggle needs to live in the browser.
 */
export const MobileNav = ({ links }: { links: NavLink[] }) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // A menu that scrolls the page behind it feels broken on a phone.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="flex size-11 items-center justify-center md:hidden"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span aria-hidden="true" className="relative block h-4 w-6">
          <span
            className={`absolute inset-x-0 top-0 h-0.5 bg-ink transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`}
          />
          <span
            className={`absolute inset-x-0 top-[7px] h-0.5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`absolute inset-x-0 bottom-0 h-0.5 bg-ink transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
          />
        </span>
      </button>

      {open ? (
        <nav
          aria-label="Main"
          className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto bg-paper px-5 py-6 md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li className="border-b border-line" key={link.href}>
                <Link
                  className={`flex min-h-14 items-center font-display text-card uppercase ${
                    pathname === link.href ? 'text-accent' : 'text-ink'
                  }`}
                  href={link.href}
                  // Closed on tap rather than by watching the path: navigating away
                  // must not leave the panel covering the page it landed on.
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  )
}
