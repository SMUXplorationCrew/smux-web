import type React from 'react'
import { BRAND_COLOR, SocialIcon } from '@/components/SocialIcon'
import { type ExtraLink, type SocialBag, type SocialLink, toSocialLinks } from '@/lib/socials'

/**
 * Every social link on the site renders through here, in one of four shapes.
 *
 * The alternative — each page building its own row — is what produced three different
 * Telegram URLs and two different orderings before this existed.
 */
export type SocialVariant = 'chip' | 'tile' | 'inline' | 'icon'

interface SocialRowProps {
  socials?: SocialBag
  /** Editor-added rows for platforms the fixed list does not cover. */
  extra?: ExtraLink[] | null
  variant?: SocialVariant
  className?: string
  /** Inverts the resting colours for dark grounds like the footer. */
  onDark?: boolean
}

/**
 * The brand colour is applied through a custom property so it can drive both the text
 * and the border on hover without repeating the literal in four utilities. Platforms
 * with no brand colour of their own fall back to the club accent, which keeps a club
 * page's own palette on its own links.
 */
const brandStyle = (link: SocialLink): React.CSSProperties =>
  ({ '--brand': BRAND_COLOR[link.kind] ?? 'var(--color-accent)' }) as React.CSSProperties

const linkProps = (link: SocialLink) => ({
  href: link.href,
  rel: link.kind === 'email' ? undefined : 'noopener noreferrer',
  target: link.kind === 'email' ? undefined : '_blank',
  style: brandStyle(link),
})

export const SocialRow = ({
  socials,
  extra,
  variant = 'chip',
  className = '',
  onDark = false,
}: SocialRowProps) => {
  const links = toSocialLinks(socials, extra)
  if (links.length === 0) return null

  if (variant === 'tile') {
    return (
      <ul className={`grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 ${className}`}>
        {links.map((link) => (
          <li key={`${link.kind}-${link.href}`}>
            <a
              className="group flex min-h-11 flex-col gap-3 border border-line bg-paper p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)]"
              {...linkProps(link)}
            >
              <SocialIcon
                className="size-6 text-muted transition-colors duration-200 group-hover:text-[var(--brand)]"
                kind={link.kind}
              />
              <span className="font-display text-eyebrow tracking-eyebrow text-ink uppercase">
                {link.label}
              </span>
              <span className="text-meta break-words text-muted">{link.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  if (variant === 'inline') {
    return (
      <ul className={`flex flex-col ${className}`}>
        {links.map((link) => (
          <li key={`${link.kind}-${link.href}`}>
            <a
              className={`group flex min-h-11 items-center gap-2.5 text-meta transition-colors duration-200 hover:text-[var(--brand)] ${
                onDark ? 'text-paper/85' : 'text-copy'
              }`}
              {...linkProps(link)}
            >
              <SocialIcon
                className={`size-4 shrink-0 transition-colors duration-200 group-hover:text-[var(--brand)] ${
                  onDark ? 'text-paper/50' : 'text-muted'
                }`}
                kind={link.kind}
              />
              <span className="break-all">{link.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  if (variant === 'icon') {
    return (
      <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
        {links.map((link) => (
          <li key={`${link.kind}-${link.href}`}>
            <a
              className={`flex size-11 items-center justify-center border transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:text-[var(--brand)] ${
                onDark ? 'border-paper/25 text-paper/75' : 'border-line text-muted'
              }`}
              {...linkProps(link)}
            >
              <SocialIcon className="size-5" kind={link.kind} />
              <span className="sr-only">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map((link) => (
        <li key={`${link.kind}-${link.href}`}>
          <a
            className={`group flex min-h-11 items-center gap-2 border px-4 font-display text-eyebrow tracking-eyebrow uppercase transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:text-[var(--brand)] ${
              onDark ? 'border-paper/25 text-paper/85' : 'border-line text-ink'
            }`}
            {...linkProps(link)}
          >
            <SocialIcon className="size-4" kind={link.kind} />
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
