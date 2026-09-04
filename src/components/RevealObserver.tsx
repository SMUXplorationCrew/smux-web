'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * One observer for the whole site, rather than a client component per section.
 *
 * Mounted once in the layout. It re-scans on navigation because the App Router keeps
 * this component mounted across route changes, so a newly rendered page's elements
 * would otherwise never be observed and would stay hidden.
 */
export const RevealObserver = () => {
  const pathname = usePathname()

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is not read in the body — it is here precisely so the effect re-runs and observes the new page's elements after a client-side navigation.
  useEffect(() => {
    const root = document.documentElement

    // Without IntersectionObserver nothing would ever reveal, so the hiding rule is
    // switched off entirely instead of leaving the page blank.
    if (typeof IntersectionObserver === 'undefined') {
      root.dataset.js = '0'
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-reveal', 'in')
          // One-way: re-hiding on scroll-up makes a page feel unstable.
          observer.unobserve(entry.target)
        }
      },
      // Fires slightly before the element's edge reaches the viewport, so the motion
      // finishes about when the reader gets there.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )

    for (const el of document.querySelectorAll('[data-reveal="idle"]')) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [pathname])

  return null
}
