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
      <Link className={className} href={url} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <a className={className} href={url} rel="noopener noreferrer" target="_blank" {...rest}>
      {children}
    </a>
  )
}
