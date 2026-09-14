'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
export function RevealObserver() {
  const pathname = usePathname()
  // biome-ignore lint/correctness/useExhaustiveDependencies: observe new route content.
  useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal="idle"]')]
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'in')
            observer.unobserve(entry.target)
          }
      },
      { threshold: 0.01 },
    )
    for (const el of elements) {
      observer.observe(el)
      if (el.getBoundingClientRect().top > window.innerHeight) el.dataset.reveal = 'waiting'
      else el.dataset.reveal = 'in'
    }
    return () => {
      observer.disconnect()
      for (const el of elements) el.dataset.reveal = 'in'
    }
  }, [pathname])
  return null
}
