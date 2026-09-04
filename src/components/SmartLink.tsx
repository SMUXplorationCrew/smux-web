import Link from 'next/link'
import type React from 'react'
import { isInternalUrl, safeUrl } from '@/lib/url'

/**
 * A link whose destination came from the CMS.
 *
 * Renders nothing when the URL is missing or unsafe, rather than an anchor that goes
 * nowhere: a button labelled "Sign up" that does not navigate is worse than no button,
 * because a visitor concludes sign-ups are broken rather than not yet open.
 */
export const SmartLink = ({
  href,
  children,
  className = '',
  target,
  rel,
  ...rest
}: {
  href: string | null | undefined
  children: React.ReactNode
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) => {
  const url = safeUrl(href)
  if (!url) return null

  if (isInternalUrl(url)) {
    return (
      <Link className={className} href={url} rel={rel} target={target} {...rest}>
        {children}
      </Link>
    )
  }

  /**
   * `target` and `rel` are pulled out of the props rather than left in the spread.
   * Spread last, a caller passing `target={undefined}` — which is what a ternary with
   * no else branch produces — would overwrite the default below with nothing, silently
   * turning off the new tab. Pass "_self" to mean the same tab on purpose.
   */
  return (
    <a
      className={className}
      href={url}
      rel={rel ?? 'noopener noreferrer'}
      target={target ?? '_blank'}
      {...rest}
    >
      {children}
    </a>
  )
}
