import type { SiteSetting } from '@/payload-types'

type Socials = NonNullable<SiteSetting['socials']>

/**
 * The "and more from our socials!" row the wireframe draws, with the five platforms it
 * names. Inline SVG rather than an icon package: five glyphs do not justify a dependency,
 * and these inherit currentColor so they theme with the page for free.
 */
const ICONS: Record<string, React.ReactNode> = {
  telegram: (
    <path d="M21.9 4.3 18.7 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.3-.1-.5-.6-.2L6.3 13.1 1.5 11.6c-1-.3-1-1 .2-1.5l19-7.3c.9-.3 1.6.2 1.2 1.5z" />
  ),
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.5 1.5 0 1 1-1.5-1.6 1.5 1.5 0 0 1 1.5 1.6z" />
  ),
  linkedin: (
    <path d="M6.9 21.5H3.3V9.2h3.6zM5.1 7.6a2.1 2.1 0 1 1 2.1-2.1 2.1 2.1 0 0 1-2.1 2.1zM21.5 21.5h-3.6v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v6.1H10V9.2h3.4v1.7a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5z" />
  ),
  tiktok: (
    <path d="M16.6 2h-3.1v13.4a2.7 2.7 0 1 1-2.3-2.7v-3.2a5.9 5.9 0 1 0 5.4 5.9V8.9a7 7 0 0 0 4.1 1.3V7a4 4 0 0 1-4.1-4z" />
  ),
  email: (
    <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 8.2 8-5.3V6.6l-8 5.3-8-5.3v1.3z" />
  ),
}

const href = (kind: string, value: string): string => {
  const v = value.trim()
  if (kind === 'email') return `mailto:${v}`
  if (/^https?:\/\//.test(v)) return v
  if (kind === 'telegram') return `https://${v.replace(/^https?:\/\//, '')}`
  if (kind === 'instagram') return `https://instagram.com/${v.replace(/^@/, '')}`
  if (kind === 'tiktok') return `https://tiktok.com/@${v.replace(/^@/, '')}`
  return `https://${v}`
}

const LABELS: Record<string, string> = {
  telegram: 'Telegram',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  email: 'Email',
}

export const SocialRow = ({
  socials,
  className = '',
}: {
  socials?: Socials | null
  className?: string
}) => {
  if (!socials) return null

  // Ordered as the wireframe draws them, and only what has actually been filled in.
  const bag = socials as Record<string, string | null | undefined>
  const ORDER = ['telegram', 'instagram', 'linkedin', 'tiktok', 'email']
  const entries: { kind: string; value: string }[] = ORDER.flatMap((kind) => {
    const value = bag[kind]
    return value ? [{ kind, value }] : []
  })

  if (entries.length === 0) return null

  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {entries.map(({ kind, value }) => (
        <li key={kind}>
          <a
            className="flex min-h-11 items-center gap-2 border border-line px-4 font-display text-eyebrow tracking-eyebrow text-ink uppercase transition-colors hover:border-accent hover:text-accent"
            href={href(kind, value)}
            rel="noopener noreferrer"
            target={kind === 'email' ? undefined : '_blank'}
          >
            <svg aria-hidden="true" className="size-4 fill-current" viewBox="0 0 24 24">
              {ICONS[kind]}
            </svg>
            {LABELS[kind]}
          </a>
        </li>
      ))}
    </ul>
  )
}
