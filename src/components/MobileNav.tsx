'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { NavLink } from '@/components/nav-links'
export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  useEffect(() => {
    if (!open) return
    const d = dialog.current
    if (!d) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    d.showModal()
    const resize = () => {
      if (window.innerWidth >= 768) {
        d.close()
        setOpen(false)
      }
    }
    window.addEventListener('resize', resize)
    return () => {
      d.close()
      document.body.style.overflow = previous
      window.removeEventListener('resize', resize)
      toggle.current?.focus()
    }
  }, [open])
  // Close on browser back/forward and programmatic navigation too.
  // biome-ignore lint/correctness/useExhaustiveDependencies: route changes close the navigation.
  useEffect(() => setOpen(false), [pathname])
  return (
    <>
      <button
        ref={toggle}
        className="icon-button md:hidden"
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">☰</span>
      </button>
      <dialog
        ref={dialog}
        className="mobile-dialog"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-card" onClick={() => setOpen(false)}>
            SMUX
          </Link>
          <button
            className="icon-button"
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        <nav aria-label="Main" className="mt-6">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  aria-current={
                    pathname === link.href || pathname.startsWith(`${link.href}/`)
                      ? 'page'
                      : undefined
                  }
                  className="flex min-h-14 items-center border-b border-line font-display text-card"
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link className="button button-primary" href="/explore" onClick={() => setOpen(false)}>
            Find your adventure
          </Link>
          <Link className="button button-quiet" href="/shortlist" onClick={() => setOpen(false)}>
            Saved adventures
          </Link>
        </div>
      </dialog>
    </>
  )
}
