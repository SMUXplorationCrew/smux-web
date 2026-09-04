import { safeUrl } from '@/lib/url'

export interface NavLink {
  href: string
  label: string
}

/**
 * The menu the site ships with, used by the header and the footer so the two can never
 * drift. /resources is intentionally absent: it is members-only, and advertising it to
 * every visitor invites a redirect to a login they cannot use.
 */
export const NAV_LINKS: NavLink[] = [
  { href: '/clubs', label: 'Clubs' },
  { href: '/events', label: 'Events' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/committee', label: 'Committee' },
  { href: '/join', label: 'Join' },
  { href: '/contact', label: 'Contact' },
]

export interface NavSetting {
  label?: string | null
  href?: string | null
  id?: string | null
}

/**
 * The committee can replace the menu from the CMS. An empty list falls back to the
 * shipped menu rather than rendering a header with no navigation at all — the most
 * likely way to reach an empty list is that nobody has filled it in yet.
 */
export const resolveNavLinks = (nav?: NavSetting[] | null): NavLink[] => {
  const rows = (nav ?? []).flatMap((row) => {
    const href = safeUrl(row?.href)
    if (!href || !row?.label) return []
    return [{ href, label: row.label }]
  })

  return rows.length > 0 ? rows : NAV_LINKS
}
