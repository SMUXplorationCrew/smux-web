import type React from 'react'

/**
 * Marks a subtree to fade and rise as it scrolls into view.
 *
 * The element is *not* parked at opacity 0 in the HTML. It renders visible, and only
 * becomes hidden once an inline script in the layout has confirmed JavaScript is
 * running — so with JS disabled or broken the page is simply a page, and the first
 * paint of a shared link is never a blank screen waiting on an observer.
 *
 * Under `prefers-reduced-motion` the hiding rule does not apply at all, so this
 * degrades to nothing rather than to a shorter animation.
 */
export const Reveal = ({
  children,
  className = '',
  /** Staggers a row of siblings. Kept small — this should not read as a sequence. */
  delay,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section' | 'article'
}) => (
  <Tag
    className={className}
    data-reveal="idle"
    style={delay ? { transitionDelay: `${delay}ms` } : undefined}
  >
    {children}
  </Tag>
)
